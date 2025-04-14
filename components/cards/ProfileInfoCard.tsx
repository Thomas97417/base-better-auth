import { getActiveSubscription } from "@/actions/sub";
import { UserType } from "@/utils/types/UserType";
import ProfileInfoForm from "../forms/ProfileInfoForm";
import CardWrapper from "../ui/card-wrapper";

interface ProfileInfoCardProps {
  user: UserType;
}

export async function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  const data = await getActiveSubscription();
  const activeSubscription = data.subscription;
  return (
    <CardWrapper
      cardTitle="Profile Information"
      cardDescription="Update your profile information"
      className="w-full shadow-none border-0"
    >
      <ProfileInfoForm user={user} activeSubscription={activeSubscription} />
    </CardWrapper>
  );
}
