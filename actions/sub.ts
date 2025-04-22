"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { PLANS } from "@/utils/constants";
import { Subscription } from "@better-auth/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { creditTokensForSubscription } from "./tokens";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function getActiveSubscription(): Promise<{
  status: boolean;
  message?: string;
  subscription: Subscription | null;
}> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      status: false,
      message: "You need to be logged in.",
      subscription: null,
    };
  }

  try {
    const activeSubs = await auth.api.listActiveSubscriptions({
      headers: await headers(),
    });
    const activeSub =
      activeSubs.length > 1
        ? activeSubs.find(
            (sub) => sub.status === "active" || sub.status === "trialing"
          )
        : activeSubs[0];
    return {
      subscription: activeSub ?? null,
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Something went wrong.",
      subscription: null,
    };
  }
}

export async function updateExistingSubscription(
  subId: string,
  switchToPriceId: string
): Promise<{ status: boolean; message: string }> {
  // Check if the user is logged in
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      status: false,
      message: "You need to be logged in.",
    };
  }

  // Check if the parameters are valid
  if (!subId || !switchToPriceId) {
    return {
      status: false,
      message: "Invalid parameters.",
    };
  }

  try {
    // Get the subscription first to check if it's a resumption
    const currentSubscription = await stripeClient.subscriptions.retrieve(
      subId
    );
    const isResumingSubscription = currentSubscription.cancel_at_period_end;

    // Get the price details to know which plan it corresponds to
    const price = await stripeClient.prices.retrieve(switchToPriceId);
    console.log("price", price);
    const plan = PLANS.find((p) => p.priceId === price.id);
    if (!plan) {
      return {
        status: false,
        message: "Invalid plan price ID.",
      };
    }
    const planName = plan.name;

    // If we're resuming, we need to update both the cancel_at_period_end and the price
    if (isResumingSubscription) {
      const updatedStripeSubscription = await stripeClient.subscriptions.update(
        subId,
        {
          cancel_at_period_end: false,
          items: [
            {
              id: currentSubscription.items.data[0].id,
              price: switchToPriceId,
            },
          ],
          proration_behavior: "create_prorations",
        }
      );

      // Update the database
      const dbSubscription = await db.subscription.findFirst({
        where: {
          stripeSubscriptionId: subId,
        },
      });

      if (!dbSubscription) {
        return {
          status: false,
          message: "Subscription not found in database.",
        };
      }

      await db.subscription.update({
        where: {
          id: dbSubscription.id,
        },
        data: {
          plan: planName,
          status: updatedStripeSubscription.status,
          periodStart: new Date(
            updatedStripeSubscription.current_period_start * 1000
          ),
          periodEnd: new Date(
            updatedStripeSubscription.current_period_end * 1000
          ),
          cancelAtPeriodEnd: false,
        },
      });

      return {
        status: true,
        message: "Subscription resumed successfully!",
      };
    }

    // Handle regular plan change (upgrade/downgrade)
    if (!currentSubscription.items.data.length) {
      return {
        status: false,
        message: "Invalid subscription. No subscription items found!",
      };
    }

    const updatedStripeSubscription = await stripeClient.subscriptions.update(
      subId,
      {
        items: [
          {
            id: currentSubscription.items.data[0].id,
            price: switchToPriceId,
          },
        ],
        cancel_at_period_end: false,
        proration_behavior: "create_prorations",
      }
    );

    // Update the database
    const dbSubscription = await db.subscription.findFirst({
      where: {
        stripeSubscriptionId: subId,
      },
    });

    if (!dbSubscription) {
      return {
        status: false,
        message: "Subscription not found in database.",
      };
    }

    await db.subscription.update({
      where: {
        id: dbSubscription.id,
      },
      data: {
        plan: planName,
        status: updatedStripeSubscription.status,
        periodStart: new Date(
          updatedStripeSubscription.current_period_start * 1000
        ),
        periodEnd: new Date(
          updatedStripeSubscription.current_period_end * 1000
        ),
        cancelAtPeriodEnd: false,
      },
    });

    //Update the user tokens
    await creditTokensForSubscription(session.user.id, planName);

    return {
      status: true,
      message: "Subscription and tokens updated successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "Something went wrong while updating the subscription.",
    };
  }
}
