import { ComponentType } from "react";

// Extend Window interface to include ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
export type NavPage = "portfolio" | "vault" | "activity";

export type TxLifecycle = "signing" | "pending" | "confirmed" | "failed" | null;

// ── Activity ──
export type TxType = "Deposit" | "Withdraw";

export interface Activity {
  id: string;
  type: TxType;
  address: string;
  amount: string;
  txHash: string;
  timestamp: string;
}

// Activity filter types

export interface ActivityTypeFilter {
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export interface ActivityFiltersProps {
  typeFilter: ActivityTypeFilter;
  pageSize: number;
  totalShown: number;
  onTypeChange: (f: ActivityTypeFilter) => void;
  onSizeChange: (s: number) => void;
}

export interface ActivityPageSizeOption {
  label: string;
  value: number;
}

// -- Risk Calculator Types --
export interface TokenRiskInput {
  symbol: string;
  usdValue: number;
}

export interface ConcentrationRisk {
  asset: string;
  percentage: number;
  message: string;
}

export interface LiquidityRisk {
  percentage: number;
  message: string;
}

export interface RiskResult {
  concentrationRisk?: ConcentrationRisk;
  liquidityRisk?: LiquidityRisk;
}