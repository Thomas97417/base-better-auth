"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CardWrapper from "../ui/card-wrapper";

export default function PasswordChangeCard() {
  const router = useRouter();

  return (
    <CardWrapper
      cardTitle="Security"
      cardDescription="Manage your password and security settings"
      className="w-full shadow-none border-0"
    >
      <div className="space-y-4">
        <p className="text-sm">
          To change your password, click the button below. You will be
          redirected to a secure page where you can safely update your password.
        </p>

        <div className="flex justify-end">
          <Button
            className="hover:cursor-pointer"
            onClick={() => router.push("/dashboard/profile/change-password")}
          >
            Change Password
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
}
