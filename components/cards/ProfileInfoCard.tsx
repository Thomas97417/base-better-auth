"use client";

import { UserType } from "@/utils/types/UserType";
import ProfileInfoForm from "../forms/ProfileInfoForm";
import CardWrapper from "../ui/card-wrapper";

interface ProfileInfoCardProps {
  user: UserType;
}

export function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  return (
    <CardWrapper
      cardTitle="Profile Information"
      cardDescription="Update your profile information"
      className="w-full shadow-none border-0"
    >
      <ProfileInfoForm user={user} />
    </CardWrapper>
  );
}
