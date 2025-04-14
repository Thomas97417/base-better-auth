import { authClient } from "@/lib/auth-client";
import { Plan } from "@/utils/types/PlanType";
import { Button } from "./button";
export default function CreateSubscriptionButton({
  plan,
  isPopular,
}: {
  plan: Plan;
  isPopular: boolean;
}) {
  const handleSubscriptionCreation = async () => {
    try {
      const { error } = await authClient.subscription.upgrade({
        plan: plan.name,
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: `${window.location.origin}/dashboard`,
      });
      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handleSubscriptionCreation}
      className={`w-full hover:cursor-pointer ${
        isPopular ? "bg-primary hover:bg-primary/90" : ""
      }`}
    >
      Get Started with {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
    </Button>
  );
}
