import { ProfileInfoCard } from "@/components/cards/ProfileInfoCard";
import ProfileSettingsCard from "@/components/cards/ProfileSettingsCard";
import { getUser } from "@/lib/auth-session";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const user = await getUser();
  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div>
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ProfileInfoCard user={user} />
          <ProfileSettingsCard />
        </div>
      </div>
    </div>
  );
}
