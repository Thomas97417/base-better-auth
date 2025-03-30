"use client";

import { useAuthState } from "@/hooks/useAuthState";
import { authClient } from "@/lib/auth-client";
import { ForgotPasswordSchema } from "@/utils/zod/forgot-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import FormError from "../FormError";
import { FormSuccess } from "../FormSuccess";

export function ForgotPasswordForm() {
  const {
    error,
    success,
    loading,
    setError,
    setSuccess,
    setLoading,
    resetState,
  } = useAuthState();

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      await authClient.forgetPassword(
        {
          email: values.email,
          redirectTo: "/reset-password",
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
            setSuccess("Reset password link has been sent");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setSuccess("");
          },
        }
      );
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      setSuccess("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  type="email"
                  placeholder="example@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          disabled={loading}
          type="submit"
          className="w-full hover:cursor-pointer"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
