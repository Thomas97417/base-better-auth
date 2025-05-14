import { PLANS } from "@/utils/constants";
import { Plan } from "@/utils/types/PlanType";
import { Subscription } from "@better-auth/stripe";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CreateSubscriptionButton from "../ui/create-sub-button";

export default function PlanCards({
  activeSubscription,
  currentPlan,
}: {
  activeSubscription: Subscription | null;
  currentPlan: Plan | null | undefined;
}) {
  return (
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
  );
}
