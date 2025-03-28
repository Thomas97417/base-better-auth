"use client";

import Avatar from "@/components/Avatar";
import CardWrapper from "@/components/card-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthState } from "@/hooks/useAuthState";
import { convertImageToBase64 } from "@/lib/convert-image";
import { UserType } from "@/utils/types/UserType";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FormError from "./form-error";
import { FormSuccess } from "./form-success";

export default function ProfileInfoForm({ user }: { user: UserType }) {
  const { loading, setLoading, error, setError, success, setSuccess } =
    useAuthState();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/user/update-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id,
          name,
          email,
          image: image ? await convertImageToBase64(image) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      if (updatedUser.image) {
        setImagePreview(updatedUser.image);
      }
      setSuccess("Profile information updated successfully");
    } catch (error) {
      console.error(error);
      setError("Failed to update profile information");
    }
    setLoading(false);
  };

  return (
    <CardWrapper
      cardTitle="Profile Information"
      cardDescription="Update your profile information"
      className="w-full shadow-none border-0"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex items-center space-x-4">
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
                  name={user?.name || null}
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
                />
              </label>
            </div>

            {/* Delete Button */}
            {imagePreview && (
              <div className="absolute -top-2 -right-2 group/delete">
                <button
                  type="button"
                  className="p-1 bg-white rounded-full shadow-md group-hover/delete:bg-gray-100 hover:cursor-pointer"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Name Field */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Field */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

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
    </CardWrapper>
  );
}
