"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { UserType } from "@/utils/types/UserType";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import { Button } from "./ui/button";

export default function Navbar({ user }: { user: UserType }) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("");
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 flex-1">
          <Link
            href="/dashboard"
            className="text-xl font-semibold hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <Button asChild variant="ghost" className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 hover:cursor-pointer">
              <Avatar src={user?.image || null} name={user?.name || null} />
              <span className="font-medium">{user?.name || user?.email}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
                className="cursor-pointer"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
      </div>
    </nav>
  );
}
