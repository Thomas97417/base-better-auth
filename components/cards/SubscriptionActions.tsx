import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import Link from "next/link";

interface SubscriptionActionsProps {
  planName: string;
}

export default function SubscriptionActionsButtons({
  planName,
}: SubscriptionActionsProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 hover:cursor-pointer" asChild>
          <Link href="/pricing">
            {planName === "" ? "Upgrade Plan" : "Manage Plan"}
            <CreditCard className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
