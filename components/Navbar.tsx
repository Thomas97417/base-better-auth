"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";
import { UserType } from "@/utils/types/UserType";
import { User } from "lucide-react";
import Link from "next/link";
import Avatar from "./Avatar";
import { ModeToggle } from "./ModeToggle";

export default function Navbar({ user }: { user?: UserType }) {
  const handleLogout = useLogout();

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 flex-1">
          {user ? (
            <Link
              href="/dashboard"
              className="text-xl font-semibold hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/"
              className="text-xl font-semibold hover:text-primary transition-colors"
            >
              Home
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 hover:cursor-pointer outline-none">
                <Avatar
                  src={user?.image || null}
                  name={user?.name || null}
                  size={40}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 dark:focus:text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
