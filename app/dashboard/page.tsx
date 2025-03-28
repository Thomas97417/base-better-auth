import SignOutButton from "@/components/SignOutButton";
import { getUser } from "@/lib/auth-session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4">
              {user?.image && (
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-12 w-12 rounded-full"
                  width={48}
                  height={48}
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome, {user?.name || "User"}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Your Dashboard
              </h3>
              <div className="mt-4">
                {/* Add your dashboard content here */}
                <p className="text-gray-600">
                  This is your personal dashboard.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex space-x-4">
                <Link
                  href="/dashboard/profile"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Profile Settings
                </Link>
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
