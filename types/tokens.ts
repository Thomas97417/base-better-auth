import { Prisma } from "@prisma/client";

export interface TokenResponse {
  status: boolean;
  message?: string;
  data?: TokenInfo;
}

export interface TokenInfo {
  balance: number;
  usedTotal: number;
  recentTransactions: TokenTransaction[];
}

export interface TokenTransaction {
  amount: number;
  action: string;
  metadata?: Prisma.JsonValue;
  createdAt: Date;
}

export type TokenAction =
  | "subscription_credit"
  | "subscription_upgrade"
  | "initial_credit"
  | "renewal_credit";

export type TokenMetadata = {
  [key: string]: string | undefined;
  planName: string;
  previousPlanName?: string;
  type: "upgrade_credit" | "initial_credit" | "renewal_credit";
  creditDate?: string;
  upgradeDate?: string;
};
