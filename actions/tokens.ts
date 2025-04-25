"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import {
  TokenAction,
  TokenInfo,
  TokenMetadata,
  TokenResponse,
} from "@/types/tokens";
import { PLANS } from "@/utils/constants";
import { UseTokensSchema } from "@/utils/zod/tokens-schema";
import { headers } from "next/headers";

/**
 * Credits tokens for a subscription change through the API
 * @param planName - Name of the new plan
 * @param previousPlanName - Optional name of the previous plan
 * @returns Promise<TokenResponse>
 */
export async function creditTokensForSubscriptionAction(
  planName: string,
  previousPlanName?: string
): Promise<TokenResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      status: false,
      message: "Unauthorized",
    };
  }

  try {
    const result = await creditTokensForSubscription(
      session.user.id,
      planName,
      previousPlanName
    );
    return {
      status: true,
      data: result
        ? {
            balance: result.balance,
            usedTotal: result.usedTotal,
            recentTransactions: [],
          }
        : undefined,
    };
  } catch (error) {
    console.error("Error crediting tokens:", error);
    return {
      status: false,
      message:
        error instanceof Error ? error.message : "Failed to credit tokens",
    };
  }
}

/**
 * Internal function to handle token crediting for subscription changes
 */
async function handleSubscriptionUpgrade(
  userId: string,
  tokenDifference: number,
  metadata: TokenMetadata
) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentUpgrade = await db.tokenTransaction.findFirst({
    where: {
      userId,
      action: "subscription_upgrade" as TokenAction,
      amount: tokenDifference,
      metadata: {
        path: ["planName"],
        equals: metadata.planName,
      },
      createdAt: { gte: thirtyDaysAgo },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentUpgrade) {
    return null;
  }

  return db.userTokens.upsert({
    where: { userId },
    create: {
      userId,
      balance: tokenDifference,
      transactions: {
        create: {
          amount: tokenDifference,
          action: "subscription_upgrade",
          metadata: metadata,
        },
      },
    },
    update: {
      balance: { increment: tokenDifference },
      transactions: {
        create: {
          amount: tokenDifference,
          action: "subscription_upgrade",
          metadata,
        },
      },
    },
  });
}

/**
 * Credits tokens based on subscription plan changes
 */
export async function creditTokensForSubscription(
  userId: string,
  planName: string,
  previousPlanName?: string
) {
  const plan = PLANS.find((p) => p.name === planName);
  if (!plan) {
    throw new Error("Plan not found");
  }

  const tokensToCredit = plan.limits.tokens;

  if (previousPlanName) {
    const previousPlan = PLANS.find((p) => p.name === previousPlanName);
    if (previousPlan) {
      const tokenDifference = tokensToCredit - previousPlan.limits.tokens;
      if (tokenDifference <= 0) return null;

      const metadata: TokenMetadata = {
        planName,
        previousPlanName: previousPlan.name,
        type: "upgrade_credit",
        upgradeDate: new Date().toISOString(),
      };

      return handleSubscriptionUpgrade(userId, tokenDifference, metadata);
    }
  }

  const metadata: TokenMetadata = {
    planName,
    type: "initial_credit",
    creditDate: new Date().toISOString(),
  };

  return db.userTokens.upsert({
    where: { userId },
    create: {
      userId,
      balance: tokensToCredit,
      transactions: {
        create: {
          amount: tokensToCredit,
          action: "subscription_credit",
          metadata,
        },
      },
    },
    update: {
      balance: { increment: tokensToCredit },
      transactions: {
        create: {
          amount: tokensToCredit,
          action: "subscription_credit",
          metadata: { ...metadata, type: "renewal_credit" },
        },
      },
    },
  });
}

/**
 * Uses tokens for a specific action
 */
export async function useTokens(userId: string, input: unknown) {
  const validation = UseTokensSchema.safeParse(input);
  if (!validation.success) {
    throw new Error("Invalid input parameters");
  }

  const { amount, action, metadata } = validation.data;
  const userTokens = await db.userTokens.findUnique({
    where: { userId },
  });

  if (!userTokens || userTokens.balance < amount) {
    throw new Error("Insufficient tokens");
  }

  return db.userTokens.update({
    where: { userId },
    data: {
      balance: { decrement: amount },
      usedTotal: { increment: amount },
      transactions: {
        create: {
          amount: -amount,
          action,
          metadata,
        },
      },
    },
  });
}

/**
 * Retrieves token information for a user
 */
export async function getTokenInfo(userId?: string): Promise<TokenInfo> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const targetUserId = userId || session.user.id;
    const userTokens = await db.userTokens.findFirst({
      where: { userId: targetUserId },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    return {
      balance: userTokens?.balance ?? 0,
      usedTotal: userTokens?.usedTotal ?? 0,
      recentTransactions: userTokens?.transactions ?? [],
    };
  } catch (error) {
    console.error("Error fetching token info:", error);
    return {
      balance: 0,
      usedTotal: 0,
      recentTransactions: [],
    };
  }
}
