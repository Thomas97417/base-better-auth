import { getActiveSubscription } from "@/actions/sub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS } from "@/utils/constants";
import { UserType } from "@/utils/types/UserType";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  KeyRound,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import PasswordChangeButton from "../ui/password-change-button";
import VerifyEmailButton from "../ui/verify-email-button";

export default async function ProfileSettingsCard({
  user,
}: {
  user: UserType;
}) {
  const { subscription: activeSubscription } = await getActiveSubscription();
  const currentPlan = activeSubscription
    ? PLANS.find((p) => p.name === activeSubscription.plan)
    : null;

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/5">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Security & Billing</CardTitle>
            <CardDescription className="mt-1.5">
              Manage your security and subscription settings
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Security Section */}
          <div>
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Account Security
            </h3>

            <div className="space-y-4">
              {/* Password Status */}
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="p-2 rounded-full bg-primary/10 shrink-0">
                  <KeyRound className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Password Protection</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your account is protected with a password. Regular changes
                    enhance security.
                  </p>
                  <div className="pt-2">
                    <PasswordChangeButton />
                  </div>
                </div>
              </div>

              {/* Email Verification Status */}
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="p-2 rounded-full bg-primary/10 shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Email Verification</p>
                    <Badge
                      variant={user.emailVerified ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {user.emailVerified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Not Verified
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.emailVerified
                      ? "Your email is verified and secure."
                      : "Please verify your email to enhance account security."}
                  </p>
                  {!user.emailVerified && (
                    <div className="pt-2">
                      <VerifyEmailButton user={user} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Section */}
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Current Plan
            </h3>

            <div className="space-y-4">
              {/* Current Plan Status */}
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="p-2 rounded-full bg-primary/10 shrink-0">
                  {activeSubscription ? (
                    <Star className="w-4 h-4 text-primary" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium capitalize">
                        {activeSubscription
                          ? activeSubscription.plan
                          : "Free Plan"}
                      </p>
                      <Badge
                        variant={
                          activeSubscription?.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {activeSubscription
                          ? activeSubscription.status
                          : "Current"}
                      </Badge>
                    </div>
                  </div>

                  {activeSubscription && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(
                          activeSubscription.periodStart || ""
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          activeSubscription.periodEnd || ""
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {activeSubscription?.cancelAtPeriodEnd ? (
                    <div className="mt-2 p-3 bg-destructive/10 rounded-md space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <p className="text-sm font-medium text-destructive">
                          Subscription Ending Soon
                        </p>
                      </div>
                      <p className="text-sm text-destructive/90">
                        Your subscription will end on{" "}
                        {new Date(
                          activeSubscription.periodEnd || ""
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {Math.ceil(
                          (new Date(
                            activeSubscription.periodEnd || ""
                          ).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days remaining with premium features
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {activeSubscription
                        ? `Includes ${currentPlan?.limits.tokens.toLocaleString()} tokens per month`
                        : "Limited features and usage. Upgrade to unlock premium features."}
                    </p>
                  )}

                  <div className="pt-3 flex gap-3 items-center">
                    <Button
                      variant="outline"
                      className="hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
                      asChild
                    >
                      <Link href="/pricing">
                        {activeSubscription ? (
                          <>
                            <CreditCard className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            Change Plan
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            Upgrade Now
                          </>
                        )}
                      </Link>
                    </Button>
                    {activeSubscription &&
                      !activeSubscription.cancelAtPeriodEnd && (
                        <Button
                          variant="outline"
                          className="hover:cursor-pointer group text-destructive hover:text-destructive border-destructive/30 hover:border-destructive hover:bg-destructive/10"
                          asChild
                        >
                          <Link href="/pricing">Cancel Plan</Link>
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
