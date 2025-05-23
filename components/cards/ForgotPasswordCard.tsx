"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordForm } from "../forms/auth/ForgotPasswordForm";
import CardWrapper from "../ui/card-wrapper";

export function ForgotPasswordCard() {
  return (
    <div className="w-full max-w-md mx-auto my-auto">
      <div className="mb-6">
        <Link
          href="/login/sign-in"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
      <CardWrapper
        cardTitle="Forgot Password"
        cardFooterDescription="Remember your password?"
        cardDescription="Enter your email to send link to reset password"
        cardFooterLink="/login/sign-in"
        cardFooterLinkTitle="Sign in"
      >
        <ForgotPasswordForm />
      </CardWrapper>
    </div>
  );
}

export default ForgotPasswordCard;
