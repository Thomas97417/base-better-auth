import Navbar from "@/components/Navbar";
import { getUser } from "@/lib/auth-session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <Navbar user={user} />
      <div className="flex flex-col px-4 sm:px-6 lg:px-8 bg-background">
        {children}
      </div>
    </div>
  );
}
