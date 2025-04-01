import Profile from "@/components/Profile";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";
export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return <Profile user={user} />;
}
