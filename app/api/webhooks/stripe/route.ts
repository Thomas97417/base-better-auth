import {
  creditTokensAfterPurchase,
  creditTokensForSubscription,
} from "@/actions/tokens";
import { db } from "@/lib/prisma";
import { PLANS } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log("⚡ Webhook received from Stripe!");

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    console.log(`🔐 Webhook signature: ${signature ? "present" : "missing"}`);

    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
      console.log(`✅ Event verified: ${event.type}`);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err);
      return NextResponse.json(
        { message: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`💰 Checkout session completed: ${session.id}`);

        // Check if this is a token package purchase
        if (session.mode === "payment" && session.metadata) {
          const userId = session.metadata.userId;
          const packageId = parseInt(session.metadata.packageId, 10);
          const tokens = parseInt(session.metadata.tokens, 10);

          if (userId && packageId && tokens) {
            try {
              // Credit tokens to the user
              await creditTokensAfterPurchase(userId, packageId, tokens);
              console.log(
                `Credited ${tokens} tokens to user ${userId} for package ${packageId}`
              );
            } catch (error) {
              console.error("Error crediting tokens after purchase:", error);
            }
          }
        }
        break;

      case "invoice.payment_succeeded":
        // Handle subscription renewal
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`💰 Invoice payment succeeded: ${invoice.id}`);

        // Make sure this is a subscription invoice
        if (invoice.subscription && invoice.customer) {
          try {
            // Get subscription details
            const subscription = await stripeClient.subscriptions.retrieve(
              invoice.subscription as string
            );

            // Check if this is a renewal (not the first invoice)
            if (
              !invoice.billing_reason ||
              invoice.billing_reason !== "subscription_create"
            ) {
              console.log(
                `🔄 Processing renewal for subscription: ${subscription.id}`
              );

              // Find the user based on Stripe customer ID
              const user = await db.user.findFirst({
                where: { stripeCustomerId: invoice.customer as string },
              });

              if (user) {
                // Get the plan name from the subscription
                const planName =
                  subscription.metadata.planName ||
                  (subscription.items.data.length > 0
                    ? await getPlanNameFromPriceId(
                        subscription.items.data[0].price.id
                      )
                    : null);

                if (planName) {
                  // Verify that tokens haven't already been credited for this period
                  const periodStart = new Date(
                    subscription.current_period_start * 1000
                  );

                  const recentTokenCredit = await db.tokenTransaction.findFirst(
                    {
                      where: {
                        userId: user.id,
                        action: "subscription_credit",
                        createdAt: { gte: periodStart },
                        metadata: {
                          path: ["type"],
                          equals: "renewal_credit",
                        },
                      },
                    }
                  );

                  if (!recentTokenCredit) {
                    // Credit tokens for this renewal
                    await creditTokensForSubscription(user.id, planName);
                    console.log(
                      `✅ Credited renewal tokens for user: ${user.id}, plan: ${planName}`
                    );
                  } else {
                    console.log(
                      `⏭️ Tokens already credited for this period for user: ${user.id}`
                    );
                  }
                } else {
                  console.error(
                    `❌ Could not determine plan name for subscription: ${subscription.id}`
                  );
                }
              } else {
                console.error(
                  `❌ User not found for customer: ${invoice.customer}`
                );
              }
            } else {
              console.log(`📝 Skipping initial subscription invoice`);
            }
          } catch (error) {
            console.error("Error processing subscription renewal:", error);
          }
        }
        break;

      // Add other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get plan name from price ID
 */
async function getPlanNameFromPriceId(priceId: string): Promise<string | null> {
  try {
    // Check if the price ID matches any of our defined plans
    const plan = PLANS.find((p) => p.priceId === priceId);
    if (plan) {
      return plan.name;
    }

    // If not found in our constants, try to get the subscription from Stripe
    const price = await stripeClient.prices.retrieve(priceId);
    return price.nickname || null;
  } catch (error) {
    console.error(`Error retrieving plan name for price ${priceId}:`, error);
    return null;
  }
}
