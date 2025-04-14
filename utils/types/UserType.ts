export type UserType = {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined | undefined;
  role: "admin" | "user";
  banned?: boolean;
  banReason?: string | null | undefined;
  banExpires?: Date | null | undefined;
  stripeCustomerId?: string | null | undefined;
};
