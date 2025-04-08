"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { UserType } from "@/utils/types/UserType";
import { Loader2, Shield, UserRound } from "lucide-react";
import { useState } from "react";

const ROLES = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
] as const;

interface UserRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSuccess: () => void;
}

export default function UserRoleDialog({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserRoleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(
    user?.role || "user"
  );

  const handleAction = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      await authClient.admin.setRole({
        userId: user.id,
        role: selectedRole as "admin" | "user",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-xl">Change User Role</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
            <Avatar className="h-10 w-10">
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
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        {value === "admin" ? (
                          <Shield className="h-4 w-4" />
                        ) : (
                          <UserRound className="h-4 w-4" />
                        )}
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the role you want to assign to this user
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleAction}
            disabled={isLoading || selectedRole === user.role}
            className="w-full sm:w-auto hover:cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating role...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Update Role
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
