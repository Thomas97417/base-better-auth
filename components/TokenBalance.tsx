import { getTokenInfo } from "@/actions/tokens";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

async function TokenBalanceContent() {
  const tokenInfo = await getTokenInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span>Available Tokens</span>
            <span className="text-2xl font-bold">{tokenInfo.balance}</span>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Total Used</span>
            <span>{tokenInfo.usedTotal}</span>
          </div>
          {tokenInfo.recentTransactions.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2">Recent Activity</h4>
              <div className="space-y-2">
                {tokenInfo.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between text-sm">
                    <span>{tx.action}</span>
                    <span
                      className={
                        tx.amount > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TokenBalance() {
  return (
    <Suspense fallback={<div>Loading tokens...</div>}>
      <TokenBalanceContent />
    </Suspense>
  );
}
