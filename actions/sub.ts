"use server";

import { auth } from "@/lib/auth";
import { Subscription } from "@better-auth/stripe";
import { headers } from "next/headers";

export async function getActiveSubscription(): Promise<{
  status: boolean;
  message?: string;
  subscription: Subscription | null;
}> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      status: false,
      message: "You need to be logged in.",
      subscription: null,
    };
  }

  try {
    const activeSubs = await auth.api.listActiveSubscriptions({
      headers: await headers(),
    });
    const activeSub =
      activeSubs.length > 1
        ? activeSubs.find(
            (sub) => sub.status === "active" || sub.status === "trialing"
          )
        : activeSubs[0];
    return {
      subscription: activeSub ?? null,
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Something went wrong.",
      subscription: null,
    };
  }
}
