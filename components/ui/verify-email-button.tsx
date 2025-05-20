"use client";

import { authClient } from "@/lib/auth-client";
import { UserType } from "@/utils/types/UserType";
import { Mail } from "lucide-react";
import { Button } from "./button";

export default function VerifyEmailButton({ user }: { user: UserType }) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        authClient.sendVerificationEmail({
          email: user.email,
          callbackURL:
            process.env.NODE_ENV === "development"
              ? `${process.env.NEXT_PUBLIC_APP_URL}/profile`
              : `${process.env.NEXT_PUBLIC_VERCEL_URL}/profile`,
        });
      }}
    >
      <Mail className="w-4 h-4" />
      Send Verification Email
    </Button>
  );
}
