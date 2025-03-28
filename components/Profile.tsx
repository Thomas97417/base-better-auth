"use client";

import { UserType } from "@/utils/types/UserType";
import PasswordChangeForm from "./PasswordChangeForm";
import ProfileInfoForm from "./ProfileInfoForm";

export default function Profile({ user }: { user: UserType }) {
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
        <ProfileInfoForm user={user} />
        <PasswordChangeForm />
      </div>
    </div>
  );
}
