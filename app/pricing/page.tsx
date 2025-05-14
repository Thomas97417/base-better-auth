import { getActiveSubscription } from "@/actions/sub";
import PlanCards from "@/components/cards/PlanCards";
import TokenPackageCards from "@/components/cards/TokenPackageCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/utils/constants";
import { CalendarOff, Clock, Zap } from "lucide-react";
import Link from "next/link";

export default async function PlansPage() {
  const { subscription: activeSubscription } = await getActiveSubscription();
  const currentPlan = activeSubscription
    ? PLANS.find((p) => p.name === activeSubscription.plan)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 pb-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          {activeSubscription ? "Upgrade Your Plan" : "Choose Your Plan"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {activeSubscription
            ? activeSubscription.cancelAtPeriodEnd
              ? `Your ${activeSubscription.plan} plan will be cancelled at the end of the current period. You can choose a new plan or resume your current one.`
              : `You are currently on the ${activeSubscription.plan} plan. Compare our plans and upgrade to get more features.`
            : "Select the perfect plan for your needs. All plans include access to our core features."}
        </p>
        {activeSubscription && (
          <div className="mt-4 flex flex-col items-center gap-3">
            <Badge variant="outline" className="text-base py-1.5">
              <Zap className="w-4 h-4 mr-1 inline" />
              Current Plan:{" "}
              {activeSubscription.plan.charAt(0).toUpperCase() +
                activeSubscription.plan.slice(1)}
            </Badge>
            {activeSubscription.cancelAtPeriodEnd &&
              activeSubscription.periodEnd && (
                <Badge
                  variant="destructive"
                  className="text-base py-1.5 gap-2 transition-all hover:opacity-80"
                >
                  <CalendarOff className="w-4 h-4 inline" />
                  <span>
                    Cancels{" "}
                    {new Date(activeSubscription.periodEnd).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                  <Clock className="w-4 h-4 inline" />
                  {Math.ceil(
                    (new Date(activeSubscription.periodEnd).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days left
                </Badge>
              )}
          </div>
        )}
      </div>

      <PlanCards
        activeSubscription={activeSubscription}
        currentPlan={currentPlan}
      />

      {/* Token Packages Section */}
      <TokenPackageCards />

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
        <p className="text-muted-foreground mb-6">
          Check out our FAQ section or contact our support team for detailed
          information about our plans.
        </p>
        <Button variant="default" asChild className="hover:scale-105">
          <Link href="/pricing/faq">View FAQ</Link>
        </Button>
      </div>
    </div>
  );
}
