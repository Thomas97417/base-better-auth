"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthState } from "@/hooks/useAuthState";
import { signIn } from "@/lib/auth-client";
import { SignInSchema } from "@/utils/zod/sign-in-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormError from "./form-error";
import GithubIcon from "./icons/github-icon";
import GoogleIcon from "./icons/google-icon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export default function SignInForm() {
  const { loading, setLoading, error, setError, resetState } = useAuthState();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    try {
      const { error: signInError } = await signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            resetState();
            setLoading(true);
          },
          onResponse: () => {
            setLoading(false);
          },
        }
      );

      if (signInError) {
        setError(signInError.message);
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={error} />

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 hover:cursor-pointer"
              onClick={async () => {
                await signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                });
              }}
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 hover:cursor-pointer"
              onClick={async () => {
                await signIn.social({
                  provider: "github",
                  callbackURL: "/dashboard",
                });
              }}
            >
              <GithubIcon />
              Sign in with Github
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
