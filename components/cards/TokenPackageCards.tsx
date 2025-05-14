import { PACKAGE_TOKENS } from "@/utils/constants";
import { Coins } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import PurchaseTokensButton from "../ui/purchase-tokens-button";

export default function TokenPackageCards() {
  return (
    <div className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Need Extra Tokens?</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Purchase token packages to instantly boost your available tokens
          without changing your subscription plan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {PACKAGE_TOKENS.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative flex flex-col hover:scale-[1.02] transition-transform duration-200 hover:border-primary ${
              pkg.id === 2 && "border-primary"
            }`}
          >
            {pkg.id === 2 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-xs font-medium">
                Most Popular
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold capitalize">
                {pkg.name} Package
              </CardTitle>
              <CardDescription className="text-sm line-clamp-2">
                {pkg.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="h-5 w-5 text-primary" />
                <span className="font-semibold">
                  {pkg.tokens.toLocaleString()} tokens
                </span>
              </div>
              <div>
                <span className="text-3xl font-bold">{pkg.price}€</span>
                <span className="text-muted-foreground text-sm"> one-time</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <PurchaseTokensButton packageId={pkg.id} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
