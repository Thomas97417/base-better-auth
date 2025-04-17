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
import { Check, Zap } from "lucide-react";
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
            ? `You are currently on the ${activeSubscription.plan} plan. Compare our plans and upgrade to get more features.`
            : "Select the perfect plan for your needs. All plans include access to our core features."}
        </p>
        {activeSubscription && (
          <div className="mt-4">
            <Badge variant="outline" className="text-base py-1.5">
              <Zap className="w-4 h-4 mr-1 inline" />
              Current Plan:{" "}
              {activeSubscription.plan.charAt(0).toUpperCase() +
                activeSubscription.plan.slice(1)}
            </Badge>
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
              className={`relative ${
                isPopular
                  ? "border-primary shadow-lg scale-105 hover:scale-[1.06]"
                  : "hover:scale-[1.02]"
              } transition-transform duration-200 ${
                isCurrentPlan ? "border-primary/50 bg-primary/5" : ""
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
              <CardContent>
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
              <CardFooter>
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
          <Link href="/plans">View FAQ</Link>
        </Button>
      </div>
    </div>
  );
}
