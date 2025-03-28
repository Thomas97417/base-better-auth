"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthState } from "@/hooks/useAuthState";
import { authClient } from "@/lib/auth-client";
import { KeyRound, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormError from "./form-error";
import { FormSuccess } from "./form-success";

export default function ChangePasswordForm() {
  const router = useRouter();
  const { loading, setLoading, error, setError, success, setSuccess } =
    useAuthState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await authClient.changePassword({
        newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setSuccess("Password updated !");
      setCurrentPassword("");
      setNewPassword("");
      setError("");
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password...");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="current-password"
            className="text-sm font-medium flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-muted-foreground" />
            Current Password
          </Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            minLength={8}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="new-password"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-muted-foreground" />
            New Password
          </Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            minLength={8}
            required
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters long
          </p>
        </div>
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 hover:cursor-pointer"
          onClick={() => router.push("/dashboard/profile")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 hover:cursor-pointer"
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
