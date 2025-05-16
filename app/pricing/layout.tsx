import Navbar from "@/components/Navbar";
import { getUserCache } from "@/lib/cache";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans | Your App Name",
  description:
    "Choose the perfect plan for your needs. Compare our pricing plans and features to find the best option for you.",
  keywords: "pricing, subscription, plans, tokens, features",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserCache();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 bg-background">
        {children}
      </div>
    </div>
  );
}
