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
import { authClient } from "@/lib/auth-client";
import { UserType } from "@/utils/types/UserType";
import { Ban, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface UserBanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSuccess: () => void;
}

export default function UserBanDialog({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserBanDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isBanned = user?.banned || false;

  const handleAction = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      if (isBanned) {
        await authClient.admin.unbanUser({
          userId: user.id,
        });
      } else {
        await authClient.admin.banUser({
          userId: user.id,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating user ban status:", error);
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
            <div
              className={`rounded-full ${
                isBanned
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-red-100 dark:bg-red-900"
              } p-3`}
            >
              {isBanned ? (
                <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <DialogTitle className="text-xl">
              {isBanned ? "Unban User Confirmation" : "Ban User Confirmation"}
            </DialogTitle>
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

          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Are you sure you want to {isBanned ? "unban" : "ban"} this user?
              {isBanned ? " This action will:" : " This action will:"}
            </div>
            <ul className="ml-4 list-disc text-sm text-muted-foreground">
              {isBanned ? (
                <>
                  <li>Allow the user to log in again</li>
                  <li>Restore access to their account</li>
                </>
              ) : (
                <>
                  <li>Prevent the user from logging in</li>
                  <li>Revoke all active sessions</li>
                </>
              )}
              <li>This action can be reversed later</li>
            </ul>
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
            variant={isBanned ? "default" : "destructive"}
            onClick={handleAction}
            disabled={isLoading}
            className="w-full sm:w-auto hover:cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isBanned ? "Unbanning user..." : "Banning user..."}
              </>
            ) : (
              <>
                {isBanned ? (
                  <ShieldCheck className="mr-2 h-4 w-4" />
                ) : (
                  <Ban className="mr-2 h-4 w-4" />
                )}
                {isBanned ? "Unban User" : "Ban User"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
