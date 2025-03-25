import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type Session = {
  user: SessionUser;
};

export async function getAuthSession(): Promise<Session> {
  const cookiesList = await cookies();
  const headers = new Headers();
  headers.set("cookie", cookiesList.toString());

  const session = await auth.api.getSession({ headers });

  if (!session) {
    redirect("/sign-in");
  }

  return session as Session;
}

export async function getRequiredSession(): Promise<{
  session: Session;
  user: SessionUser;
}> {
  const session = await getAuthSession();
  const { user } = session;

  if (!user) {
    redirect("/sign-in");
  }

  return { session, user };
}
