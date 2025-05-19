"use client";

import FormError from "@/components/forms/FormError";
import { FormSuccess } from "@/components/forms/FormSuccess";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuthState } from "@/hooks/useAuthState";
import { authClient } from "@/lib/auth-client";
import { ResetPasswordSchema } from "@/utils/zod/reset-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordField } from "../fields/password-field";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const {
    error,
    success,
    loading,
    setError,
    setLoading,
    setSuccess,
    resetState,
  } = useAuthState();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    try {
      await authClient.resetPassword(
        {
          newPassword: values.password,
          token: token as string,
        },
        {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            resetState();
            setLoading(true);
          },
          onSuccess: () => {
            setSuccess("New password has been created");
            router.replace("/login/sign-in");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PasswordField
          control={form.control}
          name="password"
          label="New Password"
          disabled={loading}
          placeholder="Enter your new password"
        />
        <PasswordField
          control={form.control}
          name="confirmPassword"
          label="Confirm New Password"
          disabled={loading}
          placeholder="Confirm your new password"
        />
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          className="w-full hover:cursor-pointer"
          disabled={loading}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
