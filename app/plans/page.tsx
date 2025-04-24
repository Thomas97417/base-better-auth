import { getActiveSubscription } from "@/actions/sub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateSubscriptionButton from "@/components/ui/create-sub-button";
import { PLANS } from "@/utils/constants";
import { CalendarOff, Check, Clock, Zap } from "lucide-react";
import Link from "next/link";

export default async function Plans() {
  const { subscription: activeSubscription } = await getActiveSubscription();
  const currentPlan = activeSubscription
    ? PLANS.find((p) => p.name === activeSubscription.plan)
    : null;

  return (
    <div className="container mx-auto my-auto px-4 py-16">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {PLANS.map((plan) => {
          const isPopular = plan.name === "pro";
          const isCurrentPlan = activeSubscription?.plan === plan.name;
          const isDowngrade = currentPlan && plan.price < currentPlan.price;

          return (
            <Card
              key={plan.name}
              className={`relative flex flex-col last:md:col-span-2 last:lg:col-span-1 ${
                isPopular
                  ? "border-primary shadow-lg scale-105 hover:scale-[1.06]"
                  : "hover:scale-[1.02]"
              } transition-transform duration-200 ${
                isCurrentPlan
                  ? "border-primary/50 bg-primary/5 scale-105 hover:scale-[1.06]"
                  : ""
              }`}
            >
              {isPopular && !isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold capitalize">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>
                      {plan.limits.tokens.toLocaleString()} tokens per month
                    </span>
                  </div>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <CreateSubscriptionButton
                  plan={plan}
                  isPopular={isPopular}
                  isCurrentPlan={isCurrentPlan}
                  isDowngrade={isDowngrade ?? false}
                  activeSubscription={activeSubscription}
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
        <p className="text-muted-foreground mb-6">
          Check out our FAQ section or contact our support team for detailed
          information about our plans.
        </p>
        <Button
          variant="outline"
          asChild
          className="hover:cursor-pointer hover:bg-primary hover:text-primary-foreground"
        >
          <Link href="/plans/faq">View FAQ</Link>
        </Button>
      </div>
    </div>
  );
}
