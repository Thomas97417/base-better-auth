"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Avatar from "@/components/ui/user-avatar";
import { useAuthState } from "@/hooks/useAuthState";
import { useImageUpload } from "@/hooks/useImageUpload";
import { convertImageToBase64 } from "@/lib/convert-image";
import { UserType } from "@/utils/types/UserType";
import { ProfileInformationSchema } from "@/utils/zod/profile-information-schema";
import { Subscription } from "@better-auth/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Shield, Star, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FormError from "./FormError";
import { FormSuccess } from "./FormSuccess";

interface ProfileInfoFormProps {
  user: UserType;
  activeSubscription: Subscription | null;
}

export default function ProfileInfoForm({
  user,
  activeSubscription,
}: ProfileInfoFormProps) {
  const router = useRouter();
  const {
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,
    resetState,
  } = useAuthState();

  const { image, imagePreview, handleImageChange, resetImage } = useImageUpload(
    {
      initialPreview: user?.image || null,
    }
  );

  const form = useForm<z.infer<typeof ProfileInformationSchema>>({
    resolver: zodResolver(ProfileInformationSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      image: user?.image || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileInformationSchema>) => {
    try {
      setLoading(true);
      resetState();

      const updateData: {
        id: string | undefined;
        fullName?: string;
        email?: string;
        image?: string;
      } = {
        id: user?.id,
      };

      if (values.fullName !== user?.fullName) {
        updateData.fullName = values.fullName;
      }

      if (values.email !== user?.email) {
        updateData.email = values.email;
      }

      if (image) {
        updateData.image = await convertImageToBase64(image);
      }

      const response = await fetch("/api/user/update-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();

      if (result.success) {
        setSuccess("Profile information updated.");
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to update profile information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-start space-y-4 mb-8">
          <div className="relative">
            {/* Image Container */}
            <div className="relative w-16 h-16 group/image">
              {imagePreview ? (
                <div className="w-full h-full overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <Avatar
                  src={user?.image || null}
                  fullName={user?.fullName || null}
                  size={64}
                />
              )}

              {/* Overlay with plus button */}
              <label
                htmlFor="profile-image"
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity cursor-pointer"
              >
                <Plus className="w-6 h-6 text-white" />
                <Input
                  id="profile-image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </label>

              {/* Delete Button */}
              {imagePreview && imagePreview !== user?.image && (
                <div className="absolute -top-2 -right-2 group/delete">
                  <button
                    type="button"
                    className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-md group-hover/delete:bg-gray-100 dark:group-hover/delete:bg-gray-700 hover:cursor-pointer"
                    onClick={resetImage}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-2 items-center">
            <Badge
              variant="default"
              className="flex items-center gap-1 px-2 py-0.5"
            >
              <Shield className="w-3 h-3" />
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </Badge>
            {activeSubscription && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-2 py-0.5"
              >
                <Star className="w-3 h-3" />
                {activeSubscription.plan.charAt(0).toUpperCase() +
                  activeSubscription.plan.slice(1)}
              </Badge>
            )}
          </div>
        </div>

        {/* Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormError message={error} />
        <FormSuccess message={success} />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="hover:cursor-pointer"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
