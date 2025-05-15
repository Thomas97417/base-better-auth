import BackButton from "@/components/admin/BackButton";
import UserSessions from "@/components/admin/UserSessions";
import UserTokens from "@/components/admin/UserTokens";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import {
  Ban,
  Calendar,
  CheckCircle,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";

export type paramsType = Promise<{ id: string }>;

export default async function UserDetailsPage(props: { params: paramsType }) {
  const { id: userId } = await props.params;
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">User not found</p>
        <BackButton text="Go Back" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Details</h1>
        <BackButton text="Back to Users" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="text-xl">
                  {user.fullName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{user.fullName}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {user.role === "admin" ? (
                    <Shield className="h-3 w-3" />
                  ) : (
                    <UserRound className="h-3 w-3" />
                  )}
                  {user.role}
                </Badge>

                {user.banned ? (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <Ban className="h-3 w-3" />
                    Banned
                  </Badge>
                ) : user.emailVerified ? (
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Not verified
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined on</span>
              </div>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {user.banned && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ban className="h-4 w-4" />
                  <span>Ban Details</span>
                </div>
                {user.banReason && (
                  <p className="text-sm text-muted-foreground">
                    Reason: {user.banReason}
                  </p>
                )}

                <p className="text-sm text-muted-foreground">
                  Expires:{" "}
                  {user.banExpires
                    ? new Date(user.banExpires).toLocaleDateString()
                    : "Permanent"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sessions Card */}
        <UserSessions userId={user.id} />

        {/* Tokens Information */}
        <UserTokens userId={user.id} />
      </div>
    </div>
  );
}
