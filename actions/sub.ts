"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import {
  StripeSubscriptionData,
  SubscriptionResponse,
  UpdateSubscriptionResponse,
} from "@/types/subscription";
import { PLANS } from "@/utils/constants";
import { SubscriptionUpdateSchema } from "@/utils/zod/subscription-schema";
import { headers } from "next/headers";
import Stripe from "stripe";
import { creditTokensForSubscription } from "./tokens";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Retrieves the active subscription for the current authenticated user
 * @returns Promise<SubscriptionResponse> Object containing subscription status and details
 */
export async function getActiveSubscription(): Promise<SubscriptionResponse> {
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
    console.error("Error fetching active subscription:", error);
    return {
      status: false,
      message: "Something went wrong.",
      subscription: null,
    };
  }
}

/**
 * Updates the Stripe subscription with new price and settings
 * @param subId - Stripe subscription ID
 * @param switchToPriceId - New price ID to switch to
 * @returns Promise<Stripe.Subscription> Updated Stripe subscription
 */
async function updateStripeSubscription(
  subId: string,
  switchToPriceId: string
): Promise<Stripe.Subscription> {
  const currentSubscription = await stripeClient.subscriptions.retrieve(subId);

  if (!currentSubscription.items.data.length) {
    throw new Error("Invalid subscription. No subscription items found!");
  }

  return await stripeClient.subscriptions.update(subId, {
    items: [
      {
        id: currentSubscription.items.data[0].id,
        price: switchToPriceId,
      },
    ],
    cancel_at_period_end: false,
    proration_behavior: "always_invoice",
  });
}

/**
 * Updates the subscription record in the database
 * @param subId - Stripe subscription ID
 * @param data - Subscription data to update
 */
async function updateDatabaseSubscription(
  subId: string,
  data: StripeSubscriptionData
): Promise<void> {
  const dbSubscription = await db.subscription.findFirst({
    where: { stripeSubscriptionId: subId },
  });

  if (!dbSubscription) {
    throw new Error("Subscription not found in database.");
  }

  await db.subscription.update({
    where: { id: dbSubscription.id },
    data,
  });
}

/**
 * Main function to update an existing subscription
 * Handles both plan changes and subscription resumption
 * @param input - Object containing subId, switchToPriceId, and optional previousPlanName
 * @returns Promise<UpdateSubscriptionResponse> Status and message of the update operation
 */
export async function updateExistingSubscription(
  input: unknown
): Promise<UpdateSubscriptionResponse> {
  // Validate session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      status: false,
      message: "You need to be logged in.",
    };
  }

  // Validate input
  const validationResult = SubscriptionUpdateSchema.safeParse(input);
  if (!validationResult.success) {
    return {
      status: false,
      message: "Invalid input parameters.",
    };
  }

  const { subId, switchToPriceId, previousPlanName } = validationResult.data;

  try {
    // Get current subscription state
    const currentSubscription = await stripeClient.subscriptions.retrieve(
      subId
    );
    const isResumingSubscription = currentSubscription.cancel_at_period_end;

    // Validate price and get plan
    const price = await stripeClient.prices.retrieve(switchToPriceId);
    const plan = PLANS.find((p) => p.priceId === price.id);
    if (!plan) {
      return {
        status: false,
        message: "Invalid plan price ID.",
      };
    }

    // Update Stripe subscription
    const updatedStripeSubscription = await updateStripeSubscription(
      subId,
      switchToPriceId
    );

    // Update database
    await updateDatabaseSubscription(subId, {
      plan: plan.name,
      status: updatedStripeSubscription.status,
      periodStart: new Date(
        updatedStripeSubscription.current_period_start * 1000
      ),
      periodEnd: new Date(updatedStripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: false,
    });

    // Update tokens if needed
    if (previousPlanName) {
      await creditTokensForSubscription(
        session.user.id,
        plan.name,
        previousPlanName
      );
    }

    return {
      status: true,
      message: isResumingSubscription
        ? "Subscription resumed successfully!"
        : "Subscription and tokens updated successfully!",
    };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return {
      status: false,
      message: "Something went wrong while updating the subscription.",
    };
  }
}
