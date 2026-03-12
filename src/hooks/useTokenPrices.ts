import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrices, TokenPrices } from "@/services/tokenPricesService";

const REFETCH_INTERVAL = 10_000; // 10 seconds

export function useTokenPrices() {
  const { data, isLoading, isError, error, refetch } = useQuery<TokenPrices>({
    queryKey: ["token-prices"],
    queryFn: fetchTokenPrices,
    refetchInterval: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
    retry: 3,
  });

  const getPrice = useCallback(
    (symbol: string) => {
      return data?.[symbol]?.USD ?? 0;
    },
    [data],
  );

  return {
    prices: data ?? {},
    getPrice,
    isLoading,
    isError,
    error,
    refetch,
  };
}
