"use client";

import { updateExistingSubscription } from "@/actions/sub";
import { creditTokensForSubscriptionAction } from "@/actions/tokens";
import { authClient } from "@/lib/auth-client";
import { Plan } from "@/utils/types/PlanType";
import { Subscription } from "@better-auth/stripe";
import {
  ArrowDownCircle,
  ArrowRightCircle,
  ArrowUpCircle,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CancelSubscriptionDialog from "../dialogs/CancelSubscriptionDialog";
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
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleSubscriptionChange = async () => {
    console.log("activeSubscription", activeSubscription);
    try {
      setLoading(true);

      if (activeSubscription?.stripeSubscriptionId) {
        // Handle upgrade/downgrade of existing subscription
        const result = await updateExistingSubscription({
          subId: activeSubscription.stripeSubscriptionId,
          switchToPriceId: plan.priceId,
          previousPlanName: activeSubscription.plan,
        });

        if (result.status) {
          toast(result.message || "Subscription updated successfully", {
            icon: "🎉",
            description: `You can now access all the features of ${
              plan.name.charAt(0).toUpperCase() + plan.name.slice(1)
            } plan.`,
          });
          router.refresh();
        } else {
          toast(result.message || "Failed to update subscription", {
            icon: "❌",
            description: "Please try again.",
          });
          console.error("Failed to update subscription:", result.message);
        }
      } else {
        // Handle new subscription
        const { error } = await authClient.subscription.upgrade({
          plan: plan.name,
          successUrl: `${window.location.origin}`,
          cancelUrl: `${window.location.origin}/plans`,
        });

        if (error) {
          toast("Failed to create subscription", {
            icon: "❌",
            description: "Please try again.",
          });
          console.error("Failed to create subscription:", error);
        } else {
          // Credit tokens for new subscription
          try {
            await creditTokensForSubscriptionAction(
              plan.name,
              activeSubscription?.plan
            );
            toast("Subscription created and tokens credited successfully!", {
              icon: "🎉",
              description: `You can now access all the features of ${
                plan.name.charAt(0).toUpperCase() + plan.name.slice(1)
              } plan.`,
            });
          } catch (tokenError) {
            console.error("Failed to credit tokens:", tokenError);
            toast("Subscription created but failed to credit tokens", {
              icon: "❌",
              description: "Please try again.",
            });
          }
        }
      }
    } catch (error) {
      toast("An unexpected error occurred", {
        icon: "❌",
        description: "Please try again.",
      });
      console.error("Subscription action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // If it's the current plan and it's cancelled, show the button to resume the subscription
  if (isCurrentPlan && activeSubscription?.cancelAtPeriodEnd) {
    return (
      <Button
        onClick={handleSubscriptionChange}
        className="w-full hover:cursor-pointer group bg-transparent border-primary/30 hover:border-primary hover:bg-primary/20 text-primary/80 hover:text-primary"
        variant="outline"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          <>
            <RotateCcw className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Resume {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}{" "}
            Subscription
          </>
        )}
      </Button>
    );
  }

  // If it's the current plan (not cancelled), show cancel button
  if (isCurrentPlan) {
    return (
      <>
        <Button
          variant="outline"
          className="w-full hover:cursor-pointer group border-destructive/30 hover:border-destructive hover:bg-destructive/10 hover:text-destructive text-destructive/80 dark:text-destructive/60 dark:hover:text-destructive dark:hover:bg-destructive/10 dark:hover:border-destructive"
          onClick={() => setIsCancelDialogOpen(true)}
        >
          <XCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          Cancel Current Plan
        </Button>

        <CancelSubscriptionDialog
          isOpen={isCancelDialogOpen}
          onClose={() => setIsCancelDialogOpen(false)}
          planName={plan.name}
        />
      </>
    );
  }

  if (isDowngrade) {
    return (
      <Button
        variant="outline"
        className="w-full hover:cursor-pointer group bg-transparent border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-600 text-yellow-500/80 dark:text-yellow-500/60 dark:hover:text-yellow-500 dark:hover:bg-yellow-500/20 dark:hover:border-yellow-500"
        onClick={handleSubscriptionChange}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          <>
            <ArrowDownCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Downgrade to{" "}
            {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSubscriptionChange}
      className={`w-full hover:cursor-pointer group ${
        isPopular
          ? activeSubscription
            ? "bg-transparent border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primary text-primary/80 dark:text-primary/60 dark:hover:text-primary dark:hover:bg-primary/20 dark:hover:border-primary"
            : "bg-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
          : activeSubscription
          ? "bg-transparent border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primary text-primary/80 dark:text-primary/60 dark:hover:text-primary dark:hover:bg-primary/20 dark:hover:border-primary"
          : "hover:bg-primary/10 hover:text-primary transition-all duration-300"
      }`}
      variant={activeSubscription ? "outline" : "default"}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing
        </>
      ) : (
        <>
          {activeSubscription ? (
            <>
              <ArrowUpCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Upgrade to{" "}
              {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
            </>
          ) : (
            <>
              Get Started with{" "}
              {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
              <ArrowRightCircle className="ml-2 h-4 w-4 transition-all group-hover:translate-x-1" />
            </>
          )}
        </>
      )}
    </Button>
  );
}
