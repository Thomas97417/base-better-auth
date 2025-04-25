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
import { CreditCard, Menu, ShieldUser, SquareUser, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./theme/ThemeToggle";
import { Button } from "./ui/button";
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
  const pathname = usePathname();

  const navLinks = user
    ? [
        {
          href: "/profile",
          icon: <SquareUser className="w-5 h-5" />,
          label: "Profile",
        },
        {
          href: "/plans",
          icon: <CreditCard className="w-5 h-5" />,
          label: "Plans",
        },
        ...(user.role === "admin"
          ? [
              {
                href: "/admin",
                icon: <ShieldUser className="w-5 h-5" />,
                label: "Admin",
              },
            ]
          : []),
      ]
    : [];

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6 flex-1">
          {user ? (
            <>
              <Link
                href="/"
                className="text-xl font-semibold hover:text-primary transition-colors flex items-center"
              >
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className="mr-2 hidden xs:block rounded-full"
                />
                <span className="text-xl font-semibold">MyApp</span>
              </Link>

              {/* Mobile Navigation Dropdown */}
              <div className="block xs:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex items-center -m-2 rounded-md hover:cursor-pointer"
                    asChild
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:cursor-pointer"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {navLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            "w-full",
                            pathname === link.href
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {link.icon}
                            {link.label}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden xs:flex justify-between xs:justify-start xs:space-x-6 flex-1 xs:flex-initial max-w-[300px] xs:max-w-none mx-4 xs:mx-0">
                {navLinks.map((link) => (
                  <NavLink key={link.href} href={link.href}>
                    <span className="flex items-center gap-1">
                      <span className="hidden sm:block">{link.icon}</span>
                      <span className="">{link.label}</span>
                    </span>
                  </NavLink>
                ))}
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
