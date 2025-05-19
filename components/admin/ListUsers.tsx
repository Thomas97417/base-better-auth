"use client";

import UserBanDialog from "@/components/admin/dialogs/UserBanDialog";
import UserRoleDialog from "@/components/admin/dialogs/UserRoleDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import { UserType } from "@/utils/types/UserType";
import { Loader2, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormError from "../forms/FormError";
import UsersDataTable from "./UsersDataTable";

export default function ListUsers() {
  const router = useRouter();
  const { users, isLoading, error, mutate } = useUsers();
  const [search, setSearch] = useState("");
  const [showBannedOnly, setShowBannedOnly] = useState(false);
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

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error) {
    return <FormError message={error.message} />;
  }

  const bannedCount = users?.filter((user) => user.banned).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search users..."
          className="md:max-w-sm max-w-full border-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant={showBannedOnly ? "destructive" : "outline"}
          size="sm"
          onClick={() => setShowBannedOnly(!showBannedOnly)}
          className={`xs:w-[180px] justify-start gap-1 hover:cursor-pointer ${
            !showBannedOnly &&
            "hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
          }`}
        >
          <UserX
            className={cn("xs:mr-2 h-4 w-4", showBannedOnly && "text-white")}
          />
          <span className="hidden xs:block">
            {showBannedOnly
              ? `Banned Users (${bannedCount})`
              : "View Banned Users"}
          </span>
        </Button>
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
