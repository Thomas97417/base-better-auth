"use client";

import UserBanDialog from "@/components/admin/dialogs/UserBanDialog";
import UserRoleDialog from "@/components/admin/dialogs/UserRoleDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import { UserType } from "@/utils/types/UserType";
import { Loader2, Shield, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormError from "../forms/FormError";
import UsersDataTable from "./UsersDataTable";

export default function ListUsers() {
  const router = useRouter();
  const { users, isLoading, error, mutate } = useUsers();
  const [search, setSearch] = useState("");
  const [showBannedOnly, setShowBannedOnly] = useState(false);
  const [showAdminsOnly, setShowAdminsOnly] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    if (showBannedOnly) {
      return matchesSearch && user.banned;
    }

    if (showAdminsOnly) {
      return matchesSearch && user.role === "admin";
    }

    return matchesSearch;
  });

  const handleViewDetails = (userId: string) => {
    router.push(`/admin/${userId}`);
  };

  const handleUserBan = (user: UserType) => {
    setSelectedUser(user);
    setIsBanDialogOpen(true);
  };

  const handleUserRole = (user: UserType) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  // Reset other filter when one is selected
  const handleFilterChange = (filterType: "banned" | "admin") => {
    if (filterType === "banned") {
      setShowBannedOnly(!showBannedOnly);
      setShowAdminsOnly(false);
    } else {
      setShowAdminsOnly(!showAdminsOnly);
      setShowBannedOnly(false);
    }
  };

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error) {
    return <FormError message={error.message} />;
  }

  const bannedCount = users?.filter((user) => user.banned).length || 0;
  const adminCount = users?.filter((user) => user.role === "admin").length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search users..."
          className="md:max-w-sm max-w-full border-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            variant={showAdminsOnly ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("admin")}
            className={`slg:w-[180px] justify-center items-center slg:justify-start gap-1 hover:cursor-pointer ${
              !showAdminsOnly &&
              "hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
            }`}
          >
            <Shield
              className={cn("h-4 w-4 slg:mr-2", showAdminsOnly && "text-white")}
            />
            <span className="hidden slg:block">
              {showAdminsOnly
                ? `Admin Users (${adminCount})`
                : "View Admin Users"}
            </span>
          </Button>

          <Button
            variant={showBannedOnly ? "destructive" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("banned")}
            className={`slg:w-[180px] justify-center items-center slg:justify-start gap-1 hover:cursor-pointer ${
              !showBannedOnly &&
              "hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
            }`}
          >
            <UserX
              className={cn("h-4 w-4 slg:mr-2", showBannedOnly && "text-white")}
            />
            <span className="hidden slg:block">
              {showBannedOnly
                ? `Banned Users (${bannedCount})`
                : "View Banned Users"}
            </span>
          </Button>
        </div>
      </div>

      {filteredUsers && (
        <UsersDataTable
          users={filteredUsers}
          onViewDetails={handleViewDetails}
          onRoleChange={handleUserRole}
          onBanAction={handleUserBan}
        />
      )}

      <UserBanDialog
        isOpen={isBanDialogOpen}
        onClose={() => setIsBanDialogOpen(false)}
        user={selectedUser}
        onSuccess={() => mutate()}
      />
      <UserRoleDialog
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        user={selectedUser}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
