"use server";
import { auth } from "@/lib/auth";
import { UserType } from "@/utils/types/UserType";
import { headers } from "next/headers";

export const getUser = async (): Promise<UserType> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return undefined;

  return {
    ...session.user,
    fullName: session.user.name,
  } as UserType;
};
