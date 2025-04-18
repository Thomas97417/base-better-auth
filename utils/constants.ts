import { Plan } from "./types/PlanType";

export const PLANS: Plan[] = [
  {
    id: 1,
    name: "basic",
    priceId: "price_1RDnclRrUMfYKqsHtyPXFgww",
    limits: {
      tokens: 100,
    },
    features: ["Gives you access to the basic features of the app"],
    price: 9.99,
    description: "Perfect for individuals getting started",
  },
  {
    id: 2,
    name: "pro",
    priceId: "price_1RDndsRrUMfYKqsHKwUuzI0z",
    limits: {
      tokens: 300,
    },
    features: ["Gives you access to the pro features of the app"],
    price: 19.99,
    description: "Best for professionals and growing teams",
  },
  {
    id: 3,
    name: "enterprise",
    priceId: "price_1RDne2RrUMfYKqsHYtIrH4z2",
    limits: {
      tokens: 1000,
    },
    features: ["Gives you access to the enterprise features of the app"],
    price: 39.99,
    description: "For large organizations with advanced needs",
  },
];
