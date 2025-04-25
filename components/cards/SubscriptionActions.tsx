"use client";

import { Button } from "@/components/ui/button";
import { PLANS } from "@/utils/constants";
import { Subscription } from "@better-auth/stripe";
import { CreditCard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CancelSubscriptionDialog from "../dialogs/CancelSubscriptionDialog";
import ResumeSubscriptionDialog from "../dialogs/ResumeSubscriptionDialog";

interface SubscriptionActionsProps {
  planName: string;
  hasActiveSubscription: boolean;
  isCancelled?: boolean;
  subscription?: Subscription | null;
}

export default function SubscriptionActionsButtons({
  planName,
  hasActiveSubscription,
  isCancelled = false,
  subscription,
}: SubscriptionActionsProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);

  // Trouver le plan actuel pour obtenir le priceId
  const currentPlan = PLANS.find((p) => p.name === planName);

  if (!hasActiveSubscription) {
    return (
      <Button className="flex-1 hover:cursor-pointer" asChild>
        <Link href="/plans" className="w-full hover:cursor-pointer">
          View Plans
          <CreditCard className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  }

  if (isCancelled) {
    return (
      <>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 hover:cursor-pointer" asChild>
            <Link href="/plans">
              Choose New Plan
              <CreditCard className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1 hover:cursor-pointer text-primary border-primary hover:bg-primary/10"
            onClick={() => setIsResumeDialogOpen(true)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Resume Subscription
          </Button>
        </div>

        <ResumeSubscriptionDialog
          isOpen={isResumeDialogOpen}
          onClose={() => setIsResumeDialogOpen(false)}
          planName={planName}
          subscriptionId={subscription?.stripeSubscriptionId ?? ""}
          priceId={currentPlan?.priceId ?? ""}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 hover:cursor-pointer" asChild>
          <Link href="/plans">
            Change Plan
            <CreditCard className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          className="flex-1 hover:cursor-pointer"
          onClick={() => setIsCancelDialogOpen(true)}
        >
          Cancel Subscription
        </Button>
      </div>

      <CancelSubscriptionDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        planName={planName}
      />
    </>
  );
}
