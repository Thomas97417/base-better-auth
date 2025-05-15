import AdminDashboard from "@/components/AdminDashboard";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return <AdminDashboard user={user} />;
}
