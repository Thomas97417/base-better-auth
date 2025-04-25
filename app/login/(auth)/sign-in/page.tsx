"use client";

import SignInForm from "@/components/forms/auth/SignInForm";
import CardWrapper from "@/components/ui/card-wrapper";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="w-full max-w-md mx-auto my-auto">
      <div className="mb-6">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
      <CardWrapper
        cardTitle="Welcome back"
        cardDescription="Enter your email to sign in to your account"
        cardFooterDescription="Don't have an account?"
        cardFooterLink="/login/sign-up"
        cardFooterLinkTitle="Sign up"
        className="w-full"
      >
        <SignInForm />
      </CardWrapper>
    </div>
  );
}
