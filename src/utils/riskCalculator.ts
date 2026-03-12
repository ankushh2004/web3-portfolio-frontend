import { RiskResult, TokenRiskInput } from "@/types";


export function calculateRisk(
  tokens: TokenRiskInput[],
  vaultValueUsd: number,
  totalPortfolioUsd: number,
): RiskResult {
  const result: RiskResult = {};

  // Guard — avoid division by zero
  if (totalPortfolioUsd <= 0) return result;

  // ── Concentration Risk ──
  // Flag the single asset with the highest USD share if it exceeds 70%
  let topAsset: TokenRiskInput | null = null;
  let topPct = 0;

  for (const token of tokens) {
    const pct = (token.usdValue / totalPortfolioUsd) * 100;
    if (pct > topPct) {
      topPct = pct;
      topAsset = token;
    }
  }

  if (topAsset && topPct > 70) {
    result.concentrationRisk = {
      asset: topAsset.symbol,
      percentage: Math.round(topPct * 10) / 10, // 1 decimal
      message: `${topPct.toFixed(1)}% of your portfolio is in ${topAsset.symbol}. Consider diversifying to reduce single-asset exposure.`,
    };
  }

  // ── Liquidity Risk ──
  // Flag when vault-locked value exceeds 50% of the total portfolio
  const vaultPct = (vaultValueUsd / totalPortfolioUsd) * 100;
  const vaultPctRounded = Math.round(vaultPct * 10) / 10;

  result.liquidityRisk = {
    percentage: vaultPctRounded,
    message:
      vaultPct > 50
        ? `${vaultPct.toFixed(1)}% of your portfolio is locked in the vault. Consider maintaining liquid reserves.`
        : `${vaultPct.toFixed(1)}% of your portfolio is deposited in the vault — within healthy range.`,
  };

  return result;
}
