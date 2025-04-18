export const STRIPE_PRICES = {
  basic: process.env.STRIPE_PRICE_ID_1!,
  pro: process.env.STRIPE_PRICE_ID_2!,
  enterprise: process.env.STRIPE_PRICE_ID_3!,
} as const;
