import { getActiveSubscription } from "@/actions/sub";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserType } from "@/utils/types/UserType";
import { UserCircle } from "lucide-react";
import ProfileInfoForm from "../forms/ProfileInfoForm";

interface ProfileInfoCardProps {
  user: UserType;
}

export async function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  const data = await getActiveSubscription();
  const activeSubscription = data.subscription;

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/5">
            <UserCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription className="mt-1.5">
              Update your profile information and email address
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[400px]">
        <ProfileInfoForm user={user} activeSubscription={activeSubscription} />
      </CardContent>
    </Card>
  );
}
