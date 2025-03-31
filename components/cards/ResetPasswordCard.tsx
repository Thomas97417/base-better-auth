"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ResetPasswordForm from "../forms/auth/ResetPasswordForm";
import CardWrapper from "../ui/card-wrapper";

export default function ResetPasswordCard() {
  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link
            href="/sign-in"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
        <CardWrapper
          cardTitle="Reset Password"
          cardDescription="Create a new password"
          cardFooterLink="/sign-in"
          cardFooterDescription="Remember your password?"
          cardFooterLinkTitle="Sign in"
        >
          <ResetPasswordForm />
        </CardWrapper>
      </div>
    </div>
  );
}
