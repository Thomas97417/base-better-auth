"use client";

import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CancelSubscriptionDialog from "../dialogs/CancelSubscriptionDialog";

interface SubscriptionActionsProps {
  planName?: string;
  hasActiveSubscription: boolean;
}

export default function SubscriptionActionsButtons({
  planName = "",
  hasActiveSubscription,
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
