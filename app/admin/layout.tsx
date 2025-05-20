import Navbar from "@/components/Navbar";
import { getUserCache } from "@/lib/cache";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserCache();

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <Navbar user={user} />
      <div className="flex flex-col pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        {children}
      </div>
    </div>
  );
}
