"use client";
import { useAuthState } from "@/hooks/useAuthState";
import { authClient } from "@/lib/auth-client";
import { ResetPasswordSchema } from "@/utils/zod/reset-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CardWrapper from "./card-wrapper";
import FormError from "./form-error";
import { FormSuccess } from "./form-success";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { PasswordField } from "./ui/password-field";

const ResetPassword = () => {
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
      // Call the authClient's reset password method, passing the email and a redirect URL.
      await authClient.resetPassword(
        {
          newPassword: values.password, // new password given by user
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
            router.replace("/sign-in");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
          },
        }
      );
    } catch (error) {
      // catches the error
      console.log(error);
      setError("Something went wrong");
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link
            href="/sign-in"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
        <CardWrapper
          cardTitle="Reset Password"
          cardDescription="Create a new password"
          cardFooterLink="/sign-in"
          cardFooterDescription="Remember your password?"
          cardFooterLinkTitle="Sign in"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <PasswordField
                control={form.control}
                name="password"
                label="New Password"
                disabled={loading}
              />
              <PasswordField
                control={form.control}
                name="confirmPassword"
                label="Confirm New Password"
                disabled={loading}
              />
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button
                type="submit"
                className="w-full hover:cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardWrapper>
      </div>
    </div>
  );
};

export default ResetPassword;
