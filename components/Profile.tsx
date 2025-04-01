"use client";

import { UserType } from "@/utils/types/UserType";
import PasswordChangeCard from "./cards/PasswordChangeCard";
import { ProfileInfoCard } from "./cards/ProfileInfoCard";

export default function Profile({ user }: { user: UserType }) {
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
        <ProfileInfoCard user={user} />
        <PasswordChangeCard />
      </div>
    </div>
  );
}
