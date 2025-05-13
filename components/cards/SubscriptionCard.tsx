import { getActiveSubscription } from "@/actions/sub";
import { getTokenInfo } from "@/actions/tokens";
import { Badge } from "@/components/ui/badge";
import CardWrapper from "@/components/ui/card-wrapper";
import { Progress } from "@/components/ui/progress";
import { PLANS } from "@/utils/constants";
import { formatNumber } from "@/utils/format";
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  History,
  X,
  Zap,
} from "lucide-react";
import { default as SubscriptionActions } from "./SubscriptionActions";

export async function SubscriptionCard() {
  const { subscription: activeSubscription } = await getActiveSubscription();
  const tokenInfo = await getTokenInfo();
  const planName = activeSubscription?.plan;
  const { balance } = await getTokenInfo(activeSubscription?.referenceId);

  if (!activeSubscription) {
    return (
      <CardWrapper
        cardTitle="Subscription Plan"
        cardDescription="Your current plan and usage"
        className="w-full"
      >
        <div className="space-y-4">
          {/* Plan Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Free Plan</h3>
                <Badge variant="secondary" className="capitalize">
                  Current
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Limited features and usage
              </p>
            </div>
            <div className="text-2xl font-bold flex items-baseline gap-1">
              <span>€0</span>
              <span className="text-sm font-normal text-muted-foreground">
                /mo
              </span>
            </div>
          </div>

          {/* Usage Section */}
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-medium">Token Allowance</span>
                </div>
                <span className="text-sm text-muted-foreground">Free Plan</span>
              </div>
              <Progress value={0} className="h-2" />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Available Tokens
                  </span>
                  <span className="font-medium">
                    {formatNumber(balance)} tokens
                  </span>
                </div>
                <div className="mt-2 flex items-start gap-2 text-sm text-primary">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Upgrade to a paid plan to get more tokens and unlock premium
                    features
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Free Plan Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Basic features access</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Community support</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <X className="h-4 w-4 flex-shrink-0" />
              <span>Monthly Token Allowance</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <X className="h-4 w-4 flex-shrink-0" />
              <span>Advanced features</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <X className="h-4 w-4 flex-shrink-0" />
              <span>Priority support</span>
            </div>
          </div>

          {/* Subscription Actions */}
          <SubscriptionActions
            hasActiveSubscription={false}
            planName={planName ?? ""}
          />
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

  // Handle token usage statistics
  const usedTokens = tokenInfo.usedTotal;
  const availableTokens = tokenInfo.balance;
  const maxTokens = currentPlan?.limits.tokens || 0;
  const tokenPercentage = Math.min((usedTokens / maxTokens) * 100, 100);
  const recentTransactions = tokenInfo.recentTransactions;

  // Calculate days remaining if subscription is cancelled
  const daysRemaining =
    activeSubscription.cancelAtPeriodEnd && activeSubscription.periodEnd
      ? Math.ceil(
          (new Date(activeSubscription.periodEnd).getTime() -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

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
              {activeSubscription.cancelAtPeriodEnd && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Cancels Soon
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Current Period: {periodStart} - {periodEnd}
            </p>
            {activeSubscription.cancelAtPeriodEnd && daysRemaining !== null && (
              <div className="flex flex-col gap-1 mt-2 bg-destructive/10 p-3 rounded-md">
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Your subscription will end on {periodEnd}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {daysRemaining} {daysRemaining === 1 ? "day" : "days"}{" "}
                  remaining with premium features
                </p>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold">
            {currentPlan?.price}
            <span>€</span>
            <span className="text-sm text-muted-foreground"> /month</span>
          </div>
        </div>

        {/* Token Usage Stats */}
        <div className="space-y-4">
          {/* Monthly Token Usage */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-medium">Monthly Token Usage</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatNumber(usedTokens)} / {formatNumber(maxTokens)}
              </span>
            </div>
            <Progress value={tokenPercentage} className="h-2" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {tokenPercentage >= 80 ? (
                  <span className="text-yellow-500 font-medium">
                    You are approaching your token limit
                  </span>
                ) : (
                  <span>
                    {Math.round(100 - tokenPercentage)}% of monthly tokens
                    remaining
                  </span>
                )}
              </span>
              <span className="font-medium">
                {formatNumber(availableTokens)} tokens available
              </span>
            </div>
          </div>

          {/* Recent Token Transactions */}
          {recentTransactions.length > 0 && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <History className="h-5 w-5 text-primary" />
                <span className="font-medium">Recent Token Activity</span>
              </div>
              <div className="space-y-2">
                {recentTransactions.slice(0, 3).map((transaction) => (
                  <div
                    key={transaction.createdAt.toString()}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-muted-foreground capitalize">
                      {transaction.action.replace(/_/g, " ")}
                    </span>
                    <span
                      className={
                        transaction.amount > 0
                          ? "text-green-500 font-medium"
                          : "text-red-500 font-medium"
                      }
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatNumber(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
        <SubscriptionActions
          hasActiveSubscription={true}
          planName={activeSubscription.plan}
          isCancelled={activeSubscription.cancelAtPeriodEnd}
          subscription={activeSubscription}
        />
      </div>
    </CardWrapper>
  );
}
