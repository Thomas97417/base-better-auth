"use client";

import UserBanDialog from "@/components/dialogs/UserBanDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import { UserType } from "@/utils/types/UserType";
import {
  Ban,
  CheckCircle,
  Loader2,
  MoreHorizontal,
  Shield,
  UserRound,
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormError from "./forms/FormError";

export default function UsersTable() {
  const router = useRouter();
  const { users, isLoading, error, mutate } = useUsers();
  const [search, setSearch] = useState("");
  const [showBannedOnly, setShowBannedOnly] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleUserAction = (user: UserType) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (userId: string) => {
    router.push(`/admin/${userId}`);
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
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant={showBannedOnly ? "destructive" : "outline"}
          size="sm"
          onClick={() => setShowBannedOnly(!showBannedOnly)}
          className="hover:cursor-pointer"
        >
          <UserX
            className={cn("mr-2 h-4 w-4", showBannedOnly && "text-white")}
          />
          {showBannedOnly
            ? `Banned Users (${bannedCount})`
            : "View Banned Users"}
        </Button>
      </div>

      {filteredUsers && filteredUsers.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback>
                        {user.fullName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.fullName}</span>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="flex items-center gap-1 w-18"
                    >
                      {user.role === "admin" ? (
                        <Shield className="mr-1 h-3 w-3" />
                      ) : (
                        <UserRound className="mr-1 h-3 w-3" />
                      )}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.banned ? (
                      <Badge variant="destructive">
                        <Ban className="mr-1 h-3 w-3" />
                        Banned
                      </Badge>
                    ) : user.emailVerified ? (
                      <Badge variant="default">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Not verified</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(user.id)}
                          className="cursor-pointer"
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUserAction(user)}
                          className={`cursor-pointer ${
                            user.banned
                              ? "text-green-600 focus:text-green-600 dark:text-green-400 dark:focus:text-green-400"
                              : "text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                          }`}
                        >
                          {user.banned ? "Unban user" : "Ban user"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex justify-center p-4">
          <span>
            {showBannedOnly ? "No banned users found" : "No users found"}
          </span>
        </div>
      )}

      <UserBanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={selectedUser}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
