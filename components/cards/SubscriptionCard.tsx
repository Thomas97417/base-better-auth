import { getActiveSubscription } from "@/actions/sub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CardWrapper from "@/components/ui/card-wrapper";
import { Progress } from "@/components/ui/progress";
import { PLANS } from "@/utils/constants";
import { Calendar, Check, CreditCard, Star, Zap } from "lucide-react";
import Link from "next/link";

export async function SubscriptionCard() {
  const { subscription: activeSubscription } = await getActiveSubscription();

  if (!activeSubscription) {
    return (
      <CardWrapper
        cardTitle="Subscription Plan"
        cardDescription="Your current plan and usage"
        className="w-full"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Free Plan</h3>
                <Badge variant="secondary" className="capitalize">
                  inactive
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                No active subscription
              </p>
            </div>
            <div className="text-2xl font-bold">Free</div>
          </div>

          {/* Free Plan Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Limited features access</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Basic support</span>
            </div>
          </div>

          {/* Subscription Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" asChild>
              <Link href="/plans">
                View Plans
                <CreditCard className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardWrapper>
    );
  }

  const currentPlan = PLANS.find(
    (plan) => plan.name === activeSubscription.plan
  );

  // Safely handle dates with null checks
  const periodStart = activeSubscription.periodStart
    ? new Date(activeSubscription.periodStart).toLocaleDateString()
    : "N/A";
  const periodEnd = activeSubscription.periodEnd
    ? new Date(activeSubscription.periodEnd).toLocaleDateString()
    : "N/A";

  // Handle usage statistics with safe defaults
  const usedTokens = 0; // We'll need to implement this based on your actual usage tracking
  const maxTokens = currentPlan?.limits.tokens || 0;
  const tokenPercentage = Math.min((usedTokens / maxTokens) * 100, 100);

  return (
    <CardWrapper
      cardTitle="Subscription Plan"
      cardDescription="Your current plan and usage"
      className="w-full"
    >
      <div className="space-y-6">
        {/* Current Plan Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold capitalize">
                {activeSubscription.plan}
              </h3>
              <Badge
                variant={
                  activeSubscription.status === "active"
                    ? "default"
                    : "secondary"
                }
                className="capitalize"
              >
                {activeSubscription.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Current Period: {periodStart} - {periodEnd}
            </p>
          </div>
          <div className="text-2xl font-bold">
            {currentPlan?.price}
            <span>€</span>
            <span className="text-sm text-muted-foreground"> /month</span>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-medium">Tokens Usage</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {usedTokens.toLocaleString()} / {maxTokens.toLocaleString()}
            </span>
          </div>
          <Progress value={tokenPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {tokenPercentage >= 80 ? (
              <span className="text-yellow-500">
                You are approaching your token limit. Consider upgrading your
                plan.
              </span>
            ) : (
              <span>
                {Math.round(100 - tokenPercentage)}% of your monthly tokens
                remaining
              </span>
            )}
          </p>
        </div>

        {/* Plan Features */}
        <div className="space-y-3">
          {currentPlan?.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Subscription Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" asChild>
            <Link href="/plans">
              Change Plan
              <CreditCard className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/billing" target="_blank">
              Manage Subscription
              <Star className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
}
