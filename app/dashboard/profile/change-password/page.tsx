import ChangePasswordForm from "@/components/ChangePasswordForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function ChangePasswordPage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-md mx-auto py-6 sm:px-6 lg:px-8">
        <Card className="bg-white shadow rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
