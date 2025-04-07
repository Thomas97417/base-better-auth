import Profile from "@/components/Profile";
import { getUser } from "@/lib/auth-session";
export default async function ProfilePage() {
  const user = await getUser();

  return <Profile user={user} />;
}
