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

export const PACKAGE_TOKENS = [
  {
    id: 1,
    name: "small",
    tokens: 40,
    priceId: "price_1ROc4YRrUMfYKqsH9k8Ac0rP",
    price: 4.99,
    description:
      "Need a small boost? Get 40 credits instantly – great for occasional use or topping off your balance when you’re just short.",
  },
  {
    id: 2,
    name: "medium",
    tokens: 80,
    priceId: "price_1ROj4oRrUMfYKqsHzS0TUIwU",
    price: 9.99,
    description:
      "For those who need a moderate boost, get 80 credits instantly – perfect for regular use or when you need a quick boost.",
  },
  {
    id: 3,
    name: "large",
    tokens: 180,
    priceId: "price_1ROj98RrUMfYKqsHvpiS0tGx",
    price: 19.99,
    description:
      "For those who need a large boost, get 180 credits instantly – perfect for when you need a big push or when you’re running low.",
  },
  {
    id: 4,
    name: "super",
    tokens: 400,
    priceId: "price_1ROjAkRrUMfYKqsH6TKBOtye",
    price: 39.99,
    description:
      "For those who need a massive boost, get 400 credits instantly – perfect for when you need a huge push or when you’re running out of credits.",
  },
];

export const INITIAL_TOKENS = 50;
