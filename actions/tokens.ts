// actions/tokens.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { PLANS } from "@/utils/constants";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";

export async function creditTokensForSubscriptionAction(
  planName: string,
  previousPlanName?: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return creditTokensForSubscription(
    session.user.id,
    planName,
    previousPlanName
  );
}

export async function creditTokensForSubscription(
  userId: string,
  planName: string,
  previousPlanName?: string
) {
  const plan = PLANS.find((p) => p.name === planName);
  if (!plan) throw new Error("Plan not found");

  const tokensToCredit = plan.limits.tokens;
  console.log("tokensToCredit", tokensToCredit);

  // If there is a previous plan, we need to calculate the difference in tokens
  if (previousPlanName) {
    const previousPlan = PLANS.find((p) => p.name === previousPlanName);
    if (previousPlan) {
      const tokenDifference = tokensToCredit - previousPlan.limits.tokens;
      console.log("tokenDifference for upgrade", tokenDifference);

      // Si la différence est négative ou nulle, ne pas créditer de tokens
      if (tokenDifference <= 0) return null;

      // Mise à jour du solde avec la différence de tokens
      const userTokens = await db.userTokens.upsert({
        where: { userId },
        create: {
          userId,
          balance: tokenDifference,
          transactions: {
            create: {
              amount: tokenDifference,
              action: "subscription_upgrade",
              metadata: {
                planName,
                previousPlanName: previousPlan.name,
                type: "upgrade_credit",
              },
            },
          },
        },
        update: {
          balance: {
            increment: tokenDifference,
          },
          transactions: {
            create: {
              amount: tokenDifference,
              action: "subscription_upgrade",
              metadata: {
                planName,
                previousPlanName: previousPlan.name,
                type: "upgrade_credit",
              },
            },
          },
        },
      });

      return userTokens;
    }
  }

  // Case of a new subscription

  const userTokens = await db.userTokens.upsert({
    where: { userId },
    create: {
      userId,
      balance: tokensToCredit,
      transactions: {
        create: {
          amount: tokensToCredit,
          action: "subscription_credit",
          metadata: { planName, type: "initial_credit" },
        },
      },
    },
    update: {
      balance: {
        increment: tokensToCredit,
      },
      transactions: {
        create: {
          amount: tokensToCredit,
          action: "subscription_credit",
          metadata: { planName, type: "renewal_credit" },
        },
      },
    },
  });

  return userTokens;
}

// Fonction pour utiliser des tokens
export async function useTokens(
  userId: string,
  amount: number,
  action: string,
  metadata?: Prisma.InputJsonValue
) {
  const userTokens = await db.userTokens.findUnique({
    where: { userId },
  });

  if (!userTokens || userTokens.balance < amount) {
    throw new Error("Insufficient tokens");
  }

  // Mise à jour du solde et enregistrement de la transaction
  const updatedTokens = await db.userTokens.update({
    where: { userId },
    data: {
      balance: {
        decrement: amount,
      },
      usedTotal: {
        increment: amount,
      },
      transactions: {
        create: {
          amount: -amount,
          action,
          metadata,
        },
      },
    },
  });

  return updatedTokens;
}

export async function getTokenInfo() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const userTokens = await db.userTokens.findFirst({
      where: { userId: session.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    return {
      balance: userTokens?.balance ?? 0,
      usedTotal: userTokens?.usedTotal ?? 0,
      recentTransactions: userTokens?.transactions ?? [],
    };
  } catch (error) {
    console.error(error);
    return {
      balance: 0,
      usedTotal: 0,
      recentTransactions: [],
    };
  }
}
