"use client";

import { updateProfile } from "@/actions/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Avatar from "@/components/ui/user-avatar";
import { useImageUpload } from "@/hooks/useImageUpload";
import { convertImageToBase64 } from "@/lib/convert-image";
import { UserType } from "@/utils/types/UserType";
import { ProfileInformationSchema } from "@/utils/zod/profile-information-schema";
import { Subscription } from "@better-auth/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Shield, Sparkles, Star, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface ProfileInfoFormProps {
  user: UserType;
  activeSubscription: Subscription | null;
}

export default function ProfileInfoForm({
  user,
  activeSubscription,
}: ProfileInfoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

      const updateData: z.infer<typeof ProfileInformationSchema> & {
        image?: string;
      } = {
        ...values,
      };

      if (image) {
        updateData.image = await convertImageToBase64(image);
      }

      const result = await updateProfile(user.id, updateData);

      if (result.success) {
        toast("Profile updated successfully", {
          icon: "🎉",
          description:
            result.message || "Your profile information has been updated.",
        });
        router.refresh();
      } else {
        toast("Failed to update profile", {
          icon: "❌",
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      toast("An unexpected error occurred", {
        icon: "❌",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-start space-y-4">
          <div className="flex items-center gap-6">
            {/* Image Container */}
            <div className="relative">
              <div className="relative w-20 h-20">
                {imagePreview ? (
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="rounded-full object-cover w-full h-full absolute inset-0"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <Avatar
                    src={user?.image || null}
                    fullName={user?.fullName || null}
                    size={80}
                  />
                )}

                {/* Overlay with plus button */}
                <label
                  htmlFor="profile-image"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
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
                  <div className="absolute -top-2 -right-2">
                    <button
                      type="button"
                      className="p-1.5 bg-white dark:bg-gray-800 border rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-colors"
                      onClick={resetImage}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Badges Column */}
            <div className="flex flex-col gap-2">
              <Badge
                variant="default"
                className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 text-primary border border-primary/20"
              >
                {user?.role === "admin" ? (
                  <Shield className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </Badge>
              {activeSubscription ? (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-2.5 py-1"
                >
                  <Star className="w-3.5 h-3.5" />
                  {activeSubscription.plan.charAt(0).toUpperCase() +
                    activeSubscription.plan.slice(1)}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-2.5 py-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Free
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    disabled={loading}
                    {...field}
                  />
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
                <FormLabel className="text-foreground">Email</FormLabel>
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
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="hover:cursor-pointer px-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
