import { getActiveSubscription } from "@/actions/sub";
import { getTokenInfo } from "@/actions/tokens";
import { Badge } from "@/components/ui/badge";
import CardWrapper from "@/components/ui/card-wrapper";
import { PLANS } from "@/utils/constants";
import { formatNumber } from "@/utils/format";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  History,
  LucideIcon,
  Package,
  Sparkles,
  Zap,
} from "lucide-react";
import { default as SubscriptionActions } from "./SubscriptionActions";

// Composant pour les statistiques de tokens
interface TokenStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  className?: string;
}

function TokenStatCard({
  title,
  value,
  icon: Icon,
  className = "",
}: TokenStatCardProps) {
  return (
    <div
      className={`p-4 bg-muted/30 rounded-lg text-center border border-primary/10 ${className}`}
    >
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-xl font-semibold">{formatNumber(value)}</p>
      </div>
    </div>
  );
}

// Composant pour les sections avec titre
interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
}

function SectionTitle({ icon: Icon, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-muted">
      <Icon className="h-5 w-5 text-primary" />
      <h3 className="font-medium">{title}</h3>
    </div>
  );
}

export async function SubscriptionCard() {
  const { subscription: activeSubscription } = await getActiveSubscription();
  const tokenInfo = await getTokenInfo();
  const planName = activeSubscription?.plan;
  const { balance } = await getTokenInfo(activeSubscription?.referenceId);

  const currentPlan = activeSubscription
    ? PLANS.find((plan) => plan.name === activeSubscription.plan)
    : null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Plan Information Card */}
      <CardWrapper
        cardTitle="Subscription"
        cardDescription="Your current plan details"
        className="w-full h-full"
      >
        <div className="space-y-6 h-full flex flex-col">
          <SectionTitle icon={CreditCard} title="Plan Details" />

          {/* Current Plan Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold capitalize">
                  {activeSubscription ? activeSubscription.plan : "Free Plan"}
                </h3>
                {activeSubscription ? (
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
                ) : (
                  <Badge variant="secondary" className="capitalize">
                    Current
                  </Badge>
                )}
              </div>

              {activeSubscription && (
                <>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Current Period:{" "}
                    {new Date(
                      activeSubscription.periodStart || ""
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      activeSubscription.periodEnd || ""
                    ).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
            <div className="text-2xl font-bold">
              {activeSubscription ? `${currentPlan?.price || 0}€` : "0€"}
              <span className="text-sm text-muted-foreground"> /month</span>
            </div>
          </div>

          {activeSubscription?.cancelAtPeriodEnd && (
            <div className="flex flex-col gap-1 bg-destructive/10 p-3 rounded-md">
              <div className="flex items-center gap-1">
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Cancels Soon
                </Badge>
              </div>
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Your subscription will end on{" "}
                {new Date(
                  activeSubscription.periodEnd || ""
                ).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.ceil(
                  (new Date(activeSubscription.periodEnd || "").getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days remaining with premium features
              </p>
            </div>
          )}

          {/* Plan Features */}
          {currentPlan ? (
            <div className="space-y-4 flex-grow">
              <SectionTitle icon={Package} title="Plan Features" />
              <div className="grid grid-cols-1 gap-3 bg-muted/20 p-4 rounded-lg border border-primary/10">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm gap-2">
                    <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <div className="bg-muted/20 p-4 rounded-lg border border-primary/10 text-center max-w-sm">
                <p className="text-sm text-muted-foreground">
                  You&apos;re currently on the Free plan with limited features.
                  Upgrade to unlock premium features and get more tokens.
                </p>
              </div>
            </div>
          )}

          {/* Subscription Actions */}
          <div className="mt-auto pt-4">
            <SubscriptionActions planName={planName ?? ""} />
          </div>
        </div>
      </CardWrapper>

      {/* Tokens Card */}
      <CardWrapper
        cardTitle="Tokens"
        cardDescription="Your token balance and usage"
        className="w-full h-full"
      >
        <div className="space-y-6 h-full flex flex-col">
          <SectionTitle icon={Zap} title="Token Balance" />

          {/* Token Balance - Highlighted */}
          <div className="p-2 bg-primary/5 rounded-lg space-y-2 text-center border border-primary/20">
            <h3 className="text-lg font-medium text-muted-foreground">
              Available Balance
            </h3>
            <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
              <Zap className="h-6 w-6" />
              {formatNumber(balance)}
            </div>
            <p className="text-sm text-muted-foreground">tokens</p>
          </div>

          {/* Token Stats */}
          {activeSubscription && (
            <div className="grid grid-cols-2 gap-4">
              <TokenStatCard
                title="Monthly Limit"
                value={currentPlan?.limits.tokens || 0}
                icon={Package}
              />
              <TokenStatCard
                title="Used"
                value={tokenInfo.usedTotal}
                icon={History}
              />
            </div>
          )}

          {/* Recent Token Transactions - Flexbox pour remplir l'espace restant */}
          <div className="flex-grow overflow-hidden flex flex-col">
            {tokenInfo.recentTransactions.length > 0 ? (
              <div className="space-y-3 h-full flex flex-col">
                <SectionTitle icon={History} title="Recent Activity" />
                <div className="space-y-2 overflow-y-auto flex-grow max-h-[160px] border border-muted/40 rounded-md bg-muted/10 p-2 pr-1">
                  {tokenInfo.recentTransactions
                    .slice(0, 8)
                    .map((transaction) => (
                      <div
                        key={transaction.createdAt.toString()}
                        className={`flex justify-between items-center text-sm p-2 rounded border `}
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
            ) : !activeSubscription ? (
              <div className="flex-grow flex items-center justify-center">
                <div className="p-4 text-sm border border-primary/10 rounded bg-primary/5 text-center">
                  <AlertCircle className="h-4 w-4 mx-auto mb-2 text-primary" />
                  <p>
                    Upgrade to a paid plan to get more tokens and access premium
                    features
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <div className="p-4 text-sm border border-muted rounded bg-muted/20 text-center">
                  <p className="text-muted-foreground">
                    No recent token activity to display
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardWrapper>
    </div>
  );
}
