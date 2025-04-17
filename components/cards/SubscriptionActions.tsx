"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CancelSubscriptionDialog from "../dialogs/CancelSubscriptionDialog";

interface SubscriptionActionsProps {
  planName?: string;
  hasActiveSubscription: boolean;
  isCancelled?: boolean;
}

export default function SubscriptionActionsButtons({
  planName = "",
  hasActiveSubscription,
  isCancelled = false,
}: SubscriptionActionsProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  if (!hasActiveSubscription) {
    return (
      <Button className="flex-1" asChild>
        <Link href="/plans">
          View Plans
          <CreditCard className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  }

  if (isCancelled) {
    return (
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
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Resume Subscription
        </Button>
      </div>
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
