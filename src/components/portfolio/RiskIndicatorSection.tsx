"use client";

import { useMemo } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { AlertTriangle, Shield } from "lucide-react";
import { SectionLabel } from "../ui/SectionLabel";
import { Alert } from "./Alert";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { ABI, CONTRACT_ADDRESS } from "@/constants/contract";
import { REFETCH_INTERVAL } from "@/constants/constants";
import { calculateRisk } from "@/utils/riskCalculator";

const RiskIndicatorSection = () => {
  const { address } = useAccount();

  // ── Wallet ETH balance ──
  const { data: walletBalance, isLoading: walletLoading } = useBalance({
    address,
    query: { enabled: !!address, refetchInterval: REFETCH_INTERVAL },
  });

  // ── Vault ETH balance ──
  const { data: vaultRaw, isLoading: vaultLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getUserBalance",
    args: [address],
    query: { enabled: !!address, refetchInterval: REFETCH_INTERVAL },
  });

  // ── ERC-20 token balances + prices ──
  const { tokens, isLoading: tokensLoading } = useTokenBalances();
  const { getPrice, isLoading: pricesLoading } = useTokenPrices();

  const isLoading =
    walletLoading || vaultLoading || tokensLoading || pricesLoading;

  // ── Calculating risk input tokens ──
  const { tokenRiskInputs, vaultValueUsd, totalPortfolioUsd } = useMemo(() => {
    if (isLoading || !address) {
      return { tokenRiskInputs: [], vaultValueUsd: 0, totalPortfolioUsd: 0 };
    }

    const ethPrice = getPrice("ETH");

    const walletEth = walletBalance
      ? parseFloat(formatEther(walletBalance.value))
      : 0;
    const vaultEth = vaultRaw ? parseFloat(formatEther(vaultRaw as bigint)) : 0;

    const walletEthUsd = walletEth * ethPrice;
    const vaultValueUsd = vaultEth * ethPrice;

    // Calculate USD value for each ERC-20 token
    const erc20Inputs = tokens.map((t) => ({
      symbol: t.symbol,
      usdValue: parseFloat(String(t.balance)) * getPrice(t.symbol),
    }));

    // including eth in inputs for concentration check
    const tokenRiskInputs = [
      { symbol: "ETH", usdValue: walletEthUsd },
      ...erc20Inputs,
    ];

    // Total portfolio value = wallet + vault + tokens
    const totalPortfolioUsd =
      tokenRiskInputs.reduce((sum, t) => sum + t.usdValue, 0) + vaultValueUsd;

    return { tokenRiskInputs, vaultValueUsd, totalPortfolioUsd };
  }, [isLoading, address, walletBalance, vaultRaw, tokens, getPrice]);

  const { concentrationRisk, liquidityRisk } = useMemo(
    () => calculateRisk(tokenRiskInputs, vaultValueUsd, totalPortfolioUsd),
    [tokenRiskInputs, vaultValueUsd, totalPortfolioUsd],
  );

  if (isLoading || totalPortfolioUsd === 0) return null;

  if (!(liquidityRisk || concentrationRisk)) return null;

  return (
    <section>
      <SectionLabel>Risk Indicators</SectionLabel>
      <div className="space-y-3">
        {/* Concentration warning — only shown when top asset > 70% */}
        {concentrationRisk && (
          <Alert
            variant="warning"
            Icon={AlertTriangle}
            title="Portfolio Concentration Warning"
            description={concentrationRisk.message}
          />
        )}

        {/* Vault utilization — always shown once data is ready */}
        {liquidityRisk && (
          <Alert
            variant={liquidityRisk.percentage > 50 ? "warning" : "info"}
            Icon={Shield}
            title={
              liquidityRisk.percentage > 50
                ? "Liquidity Risk Warning"
                : "Vault Utilization"
            }
            description={liquidityRisk.message}
          />
        )}
      </div>
    </section>
  );
};

export default RiskIndicatorSection;
