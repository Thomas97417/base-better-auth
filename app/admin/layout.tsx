import Navbar from "@/components/Navbar";
import { getUserCache } from "@/lib/cache";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserCache();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 pb-12 sm:px-6 lg:px-8 bg-background">
        {children}
      </div>
    </div>
  );
}
