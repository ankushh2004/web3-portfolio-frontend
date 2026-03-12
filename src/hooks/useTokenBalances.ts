"use client";

import { useMemo } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { TOKENS } from "@/constants/tokens";
import { ERC20_ABI } from "@/constants/erc20Abi";

export interface TokenBalance {
  name: string;
  symbol: string;
  balance: string | number;
}

export function useTokenBalances() {
  const { address } = useAccount();

  const contracts = useMemo(
    () =>
      TOKENS.map((token) => ({
        address: token.address,
        abi: ERC20_ABI,
        functionName: "balanceOf" as const,
        args: [address!] as const,
      })),
    [address],
  );

  const { data, isLoading, isError, error, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: !!address,
      refetchInterval: 100000,
    },
  });

  const tokens: TokenBalance[] = useMemo(() => {
    if (!data) return [];

    return data.map((result, index) => {
      const { name, symbol, decimals } = TOKENS[index];

      return {
        name,
        symbol,
        balance:
          result.status === "success"
            ? Number(formatUnits(result.result, decimals)).toFixed(2)
            : "",
      };
    });
  }, [data]);

  return { tokens, isLoading, isError, error, refetch };
}
