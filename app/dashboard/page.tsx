import { SubscriptionCard } from "@/components/cards/SubscriptionCard";
import { TokenBalance } from "@/components/TokenBalance";
import { Button } from "@/components/ui/button";
import CardWrapper from "@/components/ui/card-wrapper";
import UserAvatar from "@/components/ui/user-avatar";
import { getUser } from "@/lib/auth-session";
import { Activity, Settings, Shield, User } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const user = await getUser();

  return (
    <div className="flex w-full">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        {/* Welcome Card */}
        <CardWrapper
          cardTitle="Welcome Back!"
          cardDescription="Here's an overview of your account"
          className="w-full mb-6"
        >
          <div className="flex items-center space-x-4">
            <UserAvatar
              src={user?.image || null}
              fullName={user?.fullName || null}
              size={64}
            />
            <div>
              <h2 className="text-2xl font-bold">{user?.fullName || "User"}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardWrapper>

        {/* Subscription Card */}
        <div className="mb-6">
          <SubscriptionCard />
        </div>

        <div className="mb-6">
          <TokenBalance />
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
            className="w-full"
          >
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="profile">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
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
  );
}
