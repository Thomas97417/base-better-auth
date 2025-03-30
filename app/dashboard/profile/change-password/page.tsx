import ChangePasswordForm from "@/components/forms/auth/ChangePasswordForm";
import CardWrapper from "@/components/ui/card-wrapper";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ChangePasswordPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-md mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard/profile"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </div>
        <CardWrapper
          cardTitle="Change Password"
          cardDescription="Update your account password"
          className="w-full"
        >
          <ChangePasswordForm />
        </CardWrapper>
      </div>
    </div>
  );
}
