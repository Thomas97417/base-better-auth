import CardWrapper from "@/components/card-wrapper";
import SignUpForm from "@/components/SignUpForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
        <CardWrapper
          cardTitle="Create an account"
          cardDescription="Enter your information below to create your account"
          cardFooterDescription="Already have an account?"
          cardFooterLink="/sign-in"
          cardFooterLinkTitle="Sign in"
          className="w-full"
        >
          <SignUpForm />
        </CardWrapper>
      </div>
    </div>
  );
}
