"use client";

import ListUsers from "@/components/admin/ListUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import { UserType } from "@/utils/types/UserType";
import { LucideIcon, ShieldCheck, UserCheck, Users, UserX } from "lucide-react";

interface AdminDashboardProps {
  user: UserType;
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { users } = useUsers(1, { fetchAll: true });
  console.log(users);

  const totalUsers = users?.length || 0;
  const verifiedUsers = users?.filter((u) => u.emailVerified).length || 0;
  const bannedUsers = users?.filter((u) => u.banned).length || 0;
  const verifiedPercentage =
    totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;
  const bannedPercentage =
    totalUsers > 0 ? Math.round((bannedUsers / totalUsers) * 100) : 0;

  const stats: StatCardProps[] = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Active users",
      icon: Users,
    },
    {
      title: "Verified Users",
      value: verifiedUsers,
      description: `${verifiedPercentage}% of total users`,
      icon: UserCheck,
    },
    {
      title: "Banned Users",
      value: bannedUsers,
      description: `${bannedPercentage}% of total users`,
      icon: UserX,
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="py-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-full bg-primary/10">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Manage users, view statistics and monitor system activity.
          </p>
          <div className="hidden md:block text-sm text-muted-foreground">
            Connected as {user.fullName}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="last:xs:col-span-2 last:md:col-span-1"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
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
