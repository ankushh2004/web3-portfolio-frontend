import { formatToUSD } from "@/utils/utils";
import { Card } from "@/components/ui/Card";

export interface TokenCardData {
  name: string;
  symbol: string;
  balance: string | number;
  usdValue: number;
}

interface TokenCardProps {
  token: TokenCardData;
  isLoading?: boolean;
}

export function TokenCard({ token, isLoading = false }: TokenCardProps) {
  return (
    <Card hover className="p-3 sm:p-4">
      {/* Token name & symbol */}
      <p className="text-text-primary text-xs font-bold sm:text-sm">
        {token.name}
      </p>
      <p className="text-text-subtle mb-3 text-[10px] sm:text-xs">
        {token.symbol}
      </p>

      {/* Quantity */}
      <p className="text-text-primary mb-1 font-mono text-sm font-bold tabular-nums sm:text-base">
        {isLoading ? "--" : token.balance}
      </p>

      {/* USD Value */}
      <p className="text-text-muted text-[10px] sm:text-xs">
        {isLoading ? "$ --" : formatToUSD(token.usdValue)}
      </p>
    </Card>
  );
}
