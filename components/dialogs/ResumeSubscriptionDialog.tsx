import { updateExistingSubscription } from "@/actions/sub";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ResumeSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  subscriptionId: string;
  priceId: string;
}

export default function ResumeSubscriptionDialog({
  isOpen,
  onClose,
  planName,
  subscriptionId,
  priceId,
}: ResumeSubscriptionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResumeSubscription = async () => {
    // Vérifier que nous avons les données nécessaires
    if (!subscriptionId || !priceId) {
      toast("Missing subscription information", {
        icon: "❌",
        description: "Please try again.",
      });
      console.error("Missing subscription information");
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateExistingSubscription({
        subId: subscriptionId,
        switchToPriceId: priceId,
      });

      if (result.status) {
        toast("Subscription resumed successfully", {
          icon: "🎉",
          description: `You can now access all the features of ${
            planName.charAt(0).toUpperCase() + planName.slice(1)
          } plan.`,
        });
        router.push("/");
        router.refresh();
        onClose();
      } else {
        toast(result.message || "Failed to resume subscription", {
          icon: "❌",
          description: "Please try again.",
        });
        console.error("Failed to resume subscription:", result.message);
      }
    } catch (error) {
      console.error(error);
      toast("An unexpected error occurred", {
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
            <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Resume Subscription
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-muted-foreground font-medium">
            Ready to resume your{" "}
            <span className="text-foreground font-semibold">
              {planName.toUpperCase()}
            </span>{" "}
            plan benefits?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Benefits section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              You&apos;ll get immediate access to:
            </h3>
            <ul className="ml-4 space-y-3">
              {[
                "Full access to all premium features",
                "Continuous service without interruption",
                "Same billing cycle as before",
                "No additional charges until next billing period",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Note section */}
          <div className="rounded-lg border bg-muted/50 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-2">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold">Good to know</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By resuming your subscription, the cancellation will be reversed
              and your service will continue uninterrupted. Your next billing
              date remains unchanged.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto hover:cursor-pointer font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleResumeSubscription}
            disabled={isLoading}
            className="w-full sm:w-auto hover:cursor-pointer font-medium bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resuming...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Resume Subscription
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
