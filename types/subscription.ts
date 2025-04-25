import { Subscription } from "@better-auth/stripe";

export interface BaseResponse {
  status: boolean;
  message?: string;
}

export interface SubscriptionResponse extends BaseResponse {
  subscription: Subscription | null;
}

export type UpdateSubscriptionResponse = BaseResponse;

export interface SubscriptionUpdateData {
  subId: string;
  switchToPriceId: string;
  previousPlanName?: string;
}

export interface StripeSubscriptionData {
  plan: string;
  status: string;
  periodStart: Date;
  periodEnd: Date;
  cancelAtPeriodEnd: boolean;
}
