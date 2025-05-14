import { creditTokensAfterPurchase } from "@/actions/tokens";
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
