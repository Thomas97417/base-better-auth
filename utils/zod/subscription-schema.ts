import { z } from "zod";

export const SubscriptionUpdateSchema = z.object({
  subId: z.string().min(1, "Subscription ID is required"),
  switchToPriceId: z.string().min(1, "Price ID is required"),
  previousPlanName: z.string().optional(),
});

export type SubscriptionUpdateInput = z.infer<typeof SubscriptionUpdateSchema>;
