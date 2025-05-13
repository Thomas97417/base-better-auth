import { getActiveSubscription } from "@/actions/sub";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS } from "@/utils/constants";
import {
  CreditCard,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import PasswordChangeButton from "../ui/password-change-button";

export default async function ProfileSettingsCard() {
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
            <h3 className="text-sm font-medium mb-3">Account Security</h3>
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg text-sm">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-muted-foreground">
                Your account is protected with a password. We recommend changing
                it regularly for enhanced security.
              </p>
            </div>
            <div className="mt-3 flex justify-end">
              <PasswordChangeButton />
            </div>
          </div>

          {/* Billing Section */}
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-3">Current Plan</h3>
            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
              {activeSubscription ? (
                <>
                  <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">
                        {activeSubscription.plan} Plan
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentPlan?.price}€/month
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentPlan?.limits.tokens.toLocaleString()} tokens per
                      month
                    </p>
                    {activeSubscription.cancelAtPeriodEnd && (
                      <div className="mt-2 text-sm text-destructive">
                        Your subscription will be cancelled on{" "}
                        {new Date(
                          activeSubscription.periodEnd!
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Free Plan</p>
                      <p className="text-sm text-muted-foreground">0€/month</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Limited features and usage
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Billing Actions */}
            <div className="mt-3 flex justify-end gap-3">
              <Button
                variant="outline"
                className="hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
                asChild
              >
                <Link href="/plans">
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
              {activeSubscription && !activeSubscription.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  className="hover:cursor-pointer group text-destructive hover:text-destructive border-destructive/30 hover:border-destructive hover:bg-destructive/10"
                  asChild
                >
                  <Link href="/plans">Cancel Plan</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
