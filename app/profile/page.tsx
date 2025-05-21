import { ProfileInfoCard } from "@/components/cards/ProfileInfoCard";
import ProfileSettingsCard from "@/components/cards/ProfileSettingsCard";
import { getUserCache } from "@/lib/cache";
import { User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getUserCache();

  if (!user) {
    redirect("/login/sign-in");
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="py-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-full bg-primary/10">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Content */}
      <div className="py-8">
        <div className="grid gap-8 slg:grid-cols-2">
          <ProfileInfoCard user={user} />
          <ProfileSettingsCard user={user} />
        </div>
      </div>
    </div>
  );
}
