import { getAppUrl } from "@/utils/env";
import { stripeClient } from "@better-auth/stripe/client";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: getAppUrl(),
  plugins: [
    adminClient(),
    stripeClient({
      subscription: true, //if you want to enable subscription management
    }),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
