import { z } from "zod";

export const TokenMetadataSchema = z.object({
  planName: z.string(),
  previousPlanName: z.string().optional(),
  type: z.enum(["upgrade_credit", "initial_credit", "renewal_credit"]),
  creditDate: z.string().datetime().optional(),
  upgradeDate: z.string().datetime().optional(),
});

export const UseTokensSchema = z.object({
  amount: z.number().positive("Token amount must be positive"),
  action: z.string().min(1, "Action is required"),
  metadata: z.any().optional(),
});

export type TokenMetadataInput = z.infer<typeof TokenMetadataSchema>;
export type UseTokensInput = z.infer<typeof UseTokensSchema>;
