import AdminDashboard from "@/components/AdminDashboard";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getUser();
  const role = user?.role;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminDashboard user={user} />;
}
