import { creditInitialTokens } from "@/actions/tokens";
import { PLANS } from "@/utils/constants";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import Stripe from "stripe";
import { db } from "./prisma";
import { resend } from "./resend";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  rateLimit: {
    enabled: true, // Enable rate limiting for development mode
    window: 10, // window of 10 seconds
    max: 3, // 3 requests per window
  },

  user: {
    fields: {
      name: "fullName",
      role: "role",
    },
    changeEmail: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    async sendResetPassword(data) {
      // Send an email to the user with a link to reset their password
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: data.user.email,
        subject: "Reset Password",
        html: `Reset password : ${data.url}`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    nextCookies(),
    admin(),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      onCustomerCreate: async ({ customer, stripeCustomer, user }) => {
        // Credit initial free tokens to the new user
        await creditInitialTokens(user.id);

        console.log(
          `Customer ${customer.id} created for user ${user.id}, ${stripeCustomer.id}`
        );
      },
      subscription: {
        enabled: true,
        plans: PLANS,
      },
    }),
  ],
});
