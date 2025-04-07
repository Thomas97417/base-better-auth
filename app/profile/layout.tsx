import Navbar from "@/components/Navbar";
import { getUser } from "@/lib/auth-session";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <div className="flex-1 flex flex-col pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        {children}
      </div>
    </div>
  );
}
