"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserType } from "@/utils/types/UserType";
import { Ban, CheckCircle, Shield, UserRound, Users2 } from "lucide-react";
import UserActions from "./UserActions";

interface UsersDataTableProps {
  users: UserType[];
  onViewDetails: (userId: string) => void;
  onRoleChange: (user: UserType) => void;
  onBanAction: (user: UserType) => void;
}

export default function UsersDataTable({
  users,
  onViewDetails,
  onRoleChange,
  onBanAction,
}: UsersDataTableProps) {
  return (
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
          {!users.length ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Users2 className="h-8 w-8 mb-2" />
                  <span>No users found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
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
                  <UserActions
                    user={user}
                    onViewDetails={onViewDetails}
                    onRoleChange={onRoleChange}
                    onBanAction={onBanAction}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
