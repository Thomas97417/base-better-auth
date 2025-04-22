"use client";

import { updateExistingSubscription } from "@/actions/sub";
import { creditTokensForSubscriptionAction } from "@/actions/tokens";
import { authClient } from "@/lib/auth-client";
import { Plan } from "@/utils/types/PlanType";
import { Subscription } from "@better-auth/stripe";
import { RotateCcw } from "lucide-react";
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
        } else {
          // Crédit des tokens pour la nouvelle souscription
          try {
            await creditTokensForSubscriptionAction(plan.name);
            toast.success(
              "Subscription created and tokens credited successfully!"
            );
          } catch (tokenError) {
            console.error("Failed to credit tokens:", tokenError);
            toast.error("Subscription created but failed to credit tokens");
          }
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Subscription action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Si c'est le plan actuel et qu'il est annulé, montrer le bouton pour reprendre l'abonnement
  if (isCurrentPlan && activeSubscription?.cancelAtPeriodEnd) {
    return (
      <Button
        onClick={handleSubscriptionChange}
        className="w-full bg-primary/10 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:cursor-pointer"
        variant="outline"
        disabled={loading}
      >
        {loading ? (
          "Processing..."
        ) : (
          <>
            <RotateCcw className="mr-2 h-4 w-4" />
            Resume Subscription
          </>
        )}
      </Button>
    );
  }

  // Si c'est le plan actuel (non annulé), désactiver le bouton
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
        className="w-full text-yellow-600 hover:text-yellow-700 hover:cursor-pointer"
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
