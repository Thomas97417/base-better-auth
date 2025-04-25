"use server";

import { db } from "@/lib/prisma";
import { ProfileInformationSchema } from "@/utils/zod/profile-information-schema";
import { z } from "zod";

export type UpdateProfileResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function updateProfile(
  userId: string,
  data: z.infer<typeof ProfileInformationSchema> & { image?: string }
): Promise<UpdateProfileResponse> {
  try {
    const updateData: {
      fullName?: string;
      email?: string;
      image?: string;
    } = {};

    // Only include fields that have changed
    if (data.fullName) {
      updateData.fullName = data.fullName;
    }
    if (data.email) {
      updateData.email = data.email;
    }
    if (data.image) {
      updateData.image = data.image;
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    return {
      success: true,
      message: "Profile information updated successfully",
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: "Failed to update profile information",
    };
  }
}
