"use client";

import { PasswordField } from "@/components/forms/fields/password-field";
import FormError from "@/components/forms/FormError";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthState } from "@/hooks/useAuthState";
import { useImageUpload } from "@/hooks/useImageUpload";
import { signUp } from "@/lib/auth-client";
import { convertImageToBase64 } from "@/lib/convert-image";
import { SignUpSchema } from "@/utils/zod/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SignUpForm() {
  const router = useRouter();
  const { image, imagePreview, handleImageChange, resetImage } =
    useImageUpload();
  const { loading, setLoading, error, setError, resetState } = useAuthState();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      lastName: "",
      image: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    try {
      if (values.password !== values.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await signUp.email({
        email: values.email,
        password: values.password,
        name: `${values.name} ${values.lastName}`,
        image: image ? await convertImageToBase64(image) : "",
        callbackURL: "/sign-in",
        fetchOptions: {
          onResponse: () => setLoading(false),
          onRequest: () => {
            resetState();
            setLoading(true);
          },
          onError: (ctx) => setError(ctx.error.message),
          onSuccess: () => {
            router.push("/sign-in");
          },
        },
      });
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="Max" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Robinson"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <PasswordField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            disabled={loading}
          />

          <PasswordField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            disabled={loading}
          />

          <div className="space-y-2">
            <FormLabel htmlFor="image">Profile Image (optional)</FormLabel>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 w-full">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                  disabled={loading}
                />
                {imagePreview && (
                  <X className="cursor-pointer" onClick={resetImage} />
                )}
              </div>
            </div>
          </div>
        </div>

        <FormError message={error} />

        <Button
          type="submit"
          className="w-full hover:cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </Form>
  );
}
