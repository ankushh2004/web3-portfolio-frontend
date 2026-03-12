import { fetchActivityHistory } from "@/services/activityService";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export function useActivity() {
  const { address } = useAccount();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["activity", address],
    queryFn: () => fetchActivityHistory(address!),
    enabled: !!address,
    staleTime: 30_000,
    retry: 2,
  });

  return {
    activities: data ?? [],
    isLoading,
    isError,
    refetch,
  };
}
