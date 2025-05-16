import AdminDashboard from "@/components/AdminDashboard";
import { getUserCache } from "@/lib/cache";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getUserCache();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return <AdminDashboard user={user} />;
}
