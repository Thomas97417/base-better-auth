"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthState } from "@/hooks/useAuthState";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await authClient.changePassword({
        newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true,
      });

      setSuccess("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          className="mt-1"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          minLength={8}
          required
        />
      </div>

      <div>
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          className="mt-1"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          minLength={8}
          required
        />
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          className="hover:cursor-pointer"
          onClick={() => router.push("/dashboard/profile")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="hover:cursor-pointer"
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
