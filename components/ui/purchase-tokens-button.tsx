"use client";

import { purchaseTokenPackage } from "@/actions/tokens";
import { Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";

interface PurchaseTokensButtonProps {
  packageId: number;
}

export default function PurchaseTokensButton({
  packageId,
}: PurchaseTokensButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const result = await purchaseTokenPackage(packageId);

      if (result.status && result.url) {
        // Redirect to Stripe checkout
        router.push(result.url);
      } else {
        toast(result.message || "Failed to create checkout session", {
          icon: "❌",
          description: "Please try again.",
        });
      }
    } catch (error) {
      toast("An error occurred", {
        icon: "❌",
        description: "Please try again.",
      });
      console.error("Error purchasing tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      className="w-full hover:cursor-pointer group bg-transparent border border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primarytext-primary/80 dark:text-primary dark:hover:text-primary dark:hover:bg-primary/20 dark:hover:border-primary"
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing
        </>
      ) : (
        <>
          <Zap className="mr-2 h-4 w-4" />
          Buy Now
        </>
      )}
    </Button>
  );
}
