"use client";

import { useMemo } from "react";
import { BarChart3, Wallet, Shield, type LucideIcon } from "lucide-react";
import { formatToUSD } from "@/utils/utils";
import { StatCard } from "@/components/portfolio/StatCards";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { formatEther } from "viem";
import { REFETCH_INTERVAL } from "@/constants/constants";
import { ABI, CONTRACT_ADDRESS } from "@/constants/contract";
import { SectionLabel } from "../ui/SectionLabel";

interface CardConfig {
  label: string;
  value: string;
  subValue: string;
  icon: LucideIcon;
  iconClass: string;
  iconBgClass: string;
  glowClass: string;
  accentLine: string;
}

export function PortfolioSummary() {
  const { address } = useAccount();
  const { tokens, isLoading: tokensLoading } = useTokenBalances();
  const { getPrice, isLoading: pricesLoading } = useTokenPrices();

  const ethPrice = getPrice("ETH");

  // fetch user wallet balance
  const { data: walletBalance, isLoading: walletLoading } = useBalance({
    address,
    query: { enabled: !!address, refetchInterval: REFETCH_INTERVAL },
  });

  // fetch user vault balance
  const { data: userVaultBalance, isLoading: vaultLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getUserBalance",
    args: [address],
    query: { enabled: !!address, refetchInterval: REFETCH_INTERVAL },
  });

  const totalTokensUsd = useMemo(() => {
    if (tokensLoading || pricesLoading) return null;
    return tokens.reduce((sum, t) => {
      const qty = parseFloat(String(t.balance)) || 0;
      const price = getPrice(t.symbol);
      return sum + qty * price;
    }, 0);
  }, [tokens, tokensLoading, pricesLoading, getPrice]);

  const totalTokensEth =
    totalTokensUsd != null && ethPrice ? totalTokensUsd / ethPrice : null;

  const walletEthBalance = useMemo(() => {
    if (walletLoading || !address || walletBalance == null) return null;
    return parseFloat(formatEther(walletBalance.value));
  }, [walletBalance, walletLoading, address]);

  const walletUsd =
    walletEthBalance != null && ethPrice ? walletEthBalance * ethPrice : null;

  const vaultEth = useMemo(() => {
    if (vaultLoading || !address || userVaultBalance == null) return null;
    return parseFloat(formatEther(userVaultBalance as bigint));
  }, [userVaultBalance, vaultLoading, address]);

  const vaultUsd = vaultEth != null && ethPrice ? vaultEth * ethPrice : null;

  const totalPortfolioEth =
    walletEthBalance != null && vaultEth != null && totalTokensEth != null
      ? walletEthBalance + vaultEth + totalTokensEth
      : null;

  const totalPortfolioUsd =
    walletUsd != null && vaultUsd != null && totalTokensUsd != null
      ? walletUsd + vaultUsd + totalTokensUsd
      : null;

  const fmtEth = (val: number | null) =>
    val != null ? `${val.toFixed(4)} ETH` : "-- ETH";
  const fmtUsd = (val: number | null) =>
    val != null ? formatToUSD(val) : "$ --";

  const cards: CardConfig[] = useMemo(
    () => [
      {
        label: "Total Portfolio",
        value: fmtEth(totalPortfolioEth),
        subValue: fmtUsd(totalPortfolioUsd),
        icon: BarChart3,
        iconClass: "text-accent",
        iconBgClass: "bg-accent-muted",
        glowClass:
          "bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)]",
        accentLine: "from-accent to-violet-500",
      },
      {
        label: "Wallet Balance",
        value: fmtEth(walletEthBalance),
        subValue: fmtUsd(walletUsd),
        icon: Wallet,
        iconClass: "text-accent",
        iconBgClass: "bg-accent-muted",
        glowClass:
          "bg-[radial-gradient(circle,rgba(99,102,241,0.08),transparent_70%)]",
        accentLine: "from-accent to-violet-500",
      },
      {
        label: "Vault Balance",
        value: fmtEth(vaultEth),
        subValue: fmtUsd(vaultUsd),
        icon: Shield,
        iconClass: "text-success",
        iconBgClass: "bg-success-muted",
        glowClass:
          "bg-[radial-gradient(circle,rgba(52,211,153,0.08),transparent_70%)]",
        accentLine: "from-success to-teal-500",
      },
    ],

    [
      totalPortfolioEth,
      totalPortfolioUsd,
      walletEthBalance,
      walletUsd,
      vaultEth,
      vaultUsd,
    ],
  );

  return (
    <>
      <SectionLabel>Portfolio Summary</SectionLabel>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </>
  );
}
