import { creditTokensForSubscription } from "@/actions/tokens";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const preferredRegion = "fra1";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // Vérifier que c'est bien une requête cron
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("🕒 Starting subscription check cron job");

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Trouver tous les abonnements actifs renouvelés dans les dernières 24h
    const renewedSubscriptions = await db.subscription.findMany({
      where: {
        status: "active",
        periodStart: {
          gte: twentyFourHoursAgo,
          lte: now,
        },
      },
      select: {
        id: true,
        plan: true,
        periodStart: true,
      },
    });

    console.log(
      `📦 Found ${renewedSubscriptions.length} recently renewed subscriptions`
    );

    let successCount = 0;
    let errorCount = 0;

    // Traiter chaque abonnement
    for (const subscription of renewedSubscriptions) {
      try {
        // Vérifier si les tokens ont déjà été crédités pour cette période
        const recentTokenCredit = await db.tokenTransaction.findFirst({
          where: {
            userId: subscription.id,
            action: "subscription_credit",
            createdAt: {
              gte: subscription.periodStart!,
            },
            metadata: {
              path: ["type"],
              equals: "renewal_credit",
            },
          },
        });

        // Si aucun crédit récent trouvé, créditer les tokens
        if (!recentTokenCredit) {
          await creditTokensForSubscription(subscription.id, subscription.plan);
          console.log(
            `✅ Credited tokens for subscription: ${subscription.id}`
          );
          successCount++;
        } else {
          console.log(
            `⏭️ Tokens already credited for subscription: ${subscription.id}`
          );
        }
      } catch (error) {
        console.error(
          `❌ Failed to process subscription ${subscription.id}:`,
          error
        );
        errorCount++;
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        processed: renewedSubscriptions.length,
        succeeded: successCount,
        failed: errorCount,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Cron job failed:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
