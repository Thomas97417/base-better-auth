import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { AlertTriangle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export default function CancelSubscriptionDialog({
  isOpen,
  onClose,
  planName,
}: CancelSubscriptionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubCancellation = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.subscription.cancel({
        returnUrl: "/",
      });
      console.log(data, error);
      if (error) {
        toast(error.message, {
          icon: "❌",
          description: "Please try again.",
        });
      } else {
        toast("Subscription cancellation initiated", {
          icon: "🎉",
          description: "You will not be charged again.",
        });
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast("Failed to cancel subscription", {
        icon: "❌",
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-destructive/10 dark:bg-destructive/20 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Cancel Subscription
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-muted-foreground font-medium">
            Are you sure you want to cancel your{" "}
            <span className="text-foreground">
              {planName.toLocaleUpperCase()}
            </span>{" "}
            subscription?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* What happens section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">What happens next:</h3>
            <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
              <li>
                Your subscription will be cancelled at the end of the current
                billing period
              </li>
              <li>Premium features will be unavailable once the period ends</li>
              <li>
                You retain access to all features until the end of your billing
                period
              </li>
              <li>You can resubscribe anytime to restore premium access</li>
            </ul>
          </div>

          {/* Important Note section */}
          <div className="rounded-lg border bg-muted/50 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-destructive/10 dark:bg-destructive/20 p-2">
                <XCircle className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-sm font-semibold">Important Note</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your subscription benefits will remain active until the end of the
              current billing period. You will continue to have access to all
              features until then.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto hover:cursor-pointer font-medium"
          >
            Keep Subscription
          </Button>
          <Button
            onClick={handleSubCancellation}
            disabled={isLoading}
            className="w-full sm:w-auto hover:cursor-pointer font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Subscription
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
