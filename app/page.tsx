import { SubscriptionCard } from "@/components/cards/SubscriptionCard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import CardWrapper from "@/components/ui/card-wrapper";
import { getUser } from "@/lib/auth-session";
import { Activity, Home, Settings, Shield, User } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="flex w-full flex-col">
      <Navbar user={user} />
      <div className="w-full bg-background">
        {/* Welcome Header */}
        <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">
                Welcome{" "}
                <span className="text-primary">
                  {user?.fullName?.split(" ")[0]}
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
          {/* Subscription Card */}
          <div className="mb-6">
            <SubscriptionCard />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <CardWrapper
              cardTitle="Profile Settings"
              cardDescription="Manage your personal information"
              cardFooterLink="/profile"
              cardFooterLinkTitle="Edit Profile"
              className="w-full"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Update your profile details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Customize your preferences</span>
                </div>
              </div>
            </CardWrapper>

            {/* Security Card */}
            <CardWrapper
              cardTitle="Security"
              cardDescription="Manage your account security"
              cardFooterLink="/profile/password"
              cardFooterLinkTitle="Change Password"
              className="w-full"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Update your password</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>View login activity</span>
                </div>
              </div>
            </CardWrapper>

            {/* Quick Actions Card */}
            <CardWrapper
              cardTitle="Quick Actions"
              cardDescription="Common tasks and actions"
              className="w-full sm:col-span-2 lg:col-span-1"
            >
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start sm:justify-center lg:justify-start hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
                  asChild
                >
                  <Link href="profile">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start sm:justify-center lg:justify-start hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
                  asChild
                >
                  <Link href="/profile/password">
                    <Shield className="mr-2 h-4 w-4" />
                    Change Password
                  </Link>
                </Button>
              </div>
            </CardWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
