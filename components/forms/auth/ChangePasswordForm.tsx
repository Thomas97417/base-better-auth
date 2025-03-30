"use client";

import { PasswordField } from "@/components/forms/fields/password-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuthState } from "@/hooks/useAuthState";
import { authClient } from "@/lib/auth-client";
import { ChangePasswordSchema } from "@/utils/zod/change-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormError from "../FormError";
import { FormSuccess } from "../FormSuccess";

export default function ChangePasswordForm() {
  const {
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,
    resetState,
  } = useAuthState();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    try {
      setLoading(true);
      resetState();

      const response = await authClient.changePassword({
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
        revokeOtherSessions: true,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setSuccess("Password updated !");
      form.reset();
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Current Password</span>
          </div>
          <PasswordField
            control={form.control}
            name="currentPassword"
            label=""
            placeholder="Enter your current password"
            disabled={loading}
          />

          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">New Password</span>
          </div>
          <PasswordField
            control={form.control}
            name="newPassword"
            label=""
            placeholder="Enter your new password"
            disabled={loading}
          />

          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Confirm New Password</span>
          </div>
          <PasswordField
            control={form.control}
            name="confirmNewPassword"
            label=""
            placeholder="Confirm your new password"
            disabled={loading}
          />
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <div className="flex justify-between gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 hover:cursor-pointer"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
