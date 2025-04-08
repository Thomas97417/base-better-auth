"use client";

import ListUsers from "@/components/ListUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import { UserType } from "@/utils/types/UserType";
import { UserCheck, Users, UserX } from "lucide-react";

interface AdminDashboardProps {
  user: UserType;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { users } = useUsers();

  const totalUsers = users?.length || 0;
  const verifiedUsers = users?.filter((u) => u.emailVerified).length || 0;
  const bannedUsers = users?.filter((u) => u.banned).length || 0;
  const verifiedPercentage =
    totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;
  const bannedPercentage =
    totalUsers > 0 ? Math.round((bannedUsers / totalUsers) * 100) : 0;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administration</h1>
        <div className="text-sm text-muted-foreground">
          Connected as {user.fullName}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {verifiedPercentage}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bannedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {bannedPercentage}% of total users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ListUsers />
        </CardContent>
      </Card>
    </div>
  );
}
