export type Plan = {
  id: number;
  name: string;
  priceId: string;
  limits: {
    tokens: number;
  };
  features: string[];
  price: number;
  description: string;
};
