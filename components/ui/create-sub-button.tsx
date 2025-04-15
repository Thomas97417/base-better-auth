"use client";

import { updateExistingSubscription } from "@/actions/sub";
import { authClient } from "@/lib/auth-client";
import { Plan } from "@/utils/types/PlanType";
import { Subscription } from "@better-auth/stripe";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";

interface CreateSubscriptionButtonProps {
  plan: Plan;
  isPopular: boolean;
  isCurrentPlan?: boolean;
  isDowngrade?: boolean;
  activeSubscription?: Subscription | null;
}

export default function CreateSubscriptionButton({
  plan,
  isPopular,
  isCurrentPlan = false,
  isDowngrade = false,
  activeSubscription,
}: CreateSubscriptionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscriptionChange = async () => {
    try {
      setLoading(true);

      if (activeSubscription?.stripeSubscriptionId) {
        // Handle upgrade/downgrade of existing subscription
        const result = await updateExistingSubscription(
          activeSubscription.stripeSubscriptionId,
          plan.priceId
        );

        if (result.status) {
          toast.success("Subscription updated successfully");
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.error(result.message || "Failed to update subscription");
          console.error("Failed to update subscription:", result.message);
        }
      } else {
        // Handle new subscription
        const { error } = await authClient.subscription.upgrade({
          plan: plan.name,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/plans`,
        });

        if (error) {
          toast.error("Failed to create subscription");
          console.error("Failed to create subscription:", error);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Subscription action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isCurrentPlan) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Current Plan
      </Button>
    );
  }

  if (isDowngrade) {
    return (
      <Button
        variant="outline"
        className="w-full text-yellow-600 hover:text-yellow-700"
        onClick={handleSubscriptionChange}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : `Downgrade to ${
              plan.name.charAt(0).toUpperCase() + plan.name.slice(1)
            }`}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSubscriptionChange}
      className={`w-full hover:cursor-pointer ${
        isPopular ? "bg-primary hover:bg-primary/90" : ""
      }`}
      disabled={loading}
    >
      {loading ? (
        "Processing..."
      ) : (
        <>
          {activeSubscription ? "Upgrade to " : "Get Started with "}
          {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
        </>
      )}
    </Button>
  );
}
