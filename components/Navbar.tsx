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
import { cn } from "@/lib/utils";
import { UserType } from "@/utils/types/UserType";
import { CreditCard, Home, ShieldUser, SquareUser, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./theme/ThemeToggle";
import UserAvatar from "./ui/user-avatar";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}

export default function Navbar({ user }: { user?: UserType }) {
  const handleLogout = useLogout();

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 xs:space-x-6 flex-1">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-xl font-semibold hover:text-primary transition-colors"
              >
                MyApp
              </Link>
              <div className="flex space-x-1 xs:space-x-2 sm:space-x-6">
                <NavLink href="/dashboard">
                  <span className="flex items-center gap-1 xs:gap-2">
                    <Home className="w-5 h-5" />
                    <span className="hidden xs:block">Dashboard</span>
                  </span>
                </NavLink>
                <NavLink href="/profile">
                  <span className="flex items-center gap-1 xs:gap-2">
                    <SquareUser className="w-5 h-5" />
                    <span className="hidden xs:block">Profile</span>
                  </span>
                </NavLink>
                <NavLink href="/plans">
                  <span className="flex items-center gap-1 xs:gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="hidden xs:block">Plans</span>
                  </span>
                </NavLink>
                {user.role === "admin" && (
                  <NavLink href="/admin">
                    <span className="flex items-center gap-1 xs:gap-2">
                      <ShieldUser className="w-5 h-5" />
                      <span className="hidden xs:block">Admin</span>
                    </span>
                  </NavLink>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/"
              className="text-xl font-semibold hover:text-primary transition-colors"
            >
              MyApp
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 hover:cursor-pointer outline-none">
                <UserAvatar
                  src={user?.image || null}
                  fullName={user?.fullName || null}
                  size={40}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.fullName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center">
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
