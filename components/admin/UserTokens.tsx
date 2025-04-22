import { getTokenInfo } from "@/actions/tokens";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/utils/format";
import { Coins, History, TrendingDown, TrendingUp, Zap } from "lucide-react";

interface UserTokensProps {
  userId: string;
}

export default async function UserTokens({ userId }: UserTokensProps) {
  const tokenInfo = await getTokenInfo(userId);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Token Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Available Balance</span>
            </div>
            <p className="text-2xl font-bold">
              {formatNumber(tokenInfo.balance)}
            </p>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="h-4 w-4" />
              <span>Total Used</span>
            </div>
            <p className="text-2xl font-bold">
              {formatNumber(tokenInfo.usedTotal)}
            </p>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Total Credits</span>
            </div>
            <p className="text-2xl font-bold">
              {formatNumber(tokenInfo.balance + tokenInfo.usedTotal)}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <h3 className="font-semibold">Recent Transactions</h3>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenInfo.recentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  tokenInfo.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.action.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell
                        className={
                          transaction.amount > 0
                            ? "text-green-500 font-medium"
                            : "text-red-500 font-medium"
                        }
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatNumber(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {typeof transaction.metadata === "object" &&
                          transaction.metadata !== null &&
                          "type" in transaction.metadata &&
                          typeof transaction.metadata.type === "string" &&
                          transaction.metadata.type.replace(/_/g, " ")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
