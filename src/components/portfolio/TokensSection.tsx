"use client";

import { useMemo } from "react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { TOKENS } from "@/constants/tokens";
import { SectionLabel } from "../ui/SectionLabel";
import { TokenCard } from "./TokenCard";
import type { TokenCardData } from "./TokenCard";

const TokensSection = () => {
  const {
    tokens,
    isLoading: balancesLoading,
    isError: balancesError,
  } = useTokenBalances();

  const {
    getPrice,
    isLoading: pricesLoading,
    isError: pricesError,
  } = useTokenPrices();

  const isLoading = balancesLoading || pricesLoading;
  const isError = balancesError || pricesError;

 
  const tokenCards: TokenCardData[] = useMemo(() => {
    if (isLoading) {
      return TOKENS.map((t) => ({
        name: t.name,
        symbol: t.symbol,
        balance: 0,
        usdValue: 0,
      }));
    }

    return tokens.map((t) => {
      const qty = Number(t.balance) || 0;
      const price = getPrice(t.symbol);

      return {
        name: t.name,
        symbol: t.symbol,
        balance: t.balance,
        usdValue: qty * price,
      };
    });
  }, [tokens, getPrice, isLoading]);

  if (isError) {
    return (
      <section>
        <SectionLabel>Token Balances</SectionLabel>
        <p className="text-danger text-sm">
          Failed to load token data. Please Refresh &amp; try again.
        </p>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Token Balances</SectionLabel>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tokenCards.map((token) => (
          <TokenCard key={token.symbol} token={token} isLoading={isLoading} />
        ))}
      </div>
    </section>
  );
};
export default TokensSection;
