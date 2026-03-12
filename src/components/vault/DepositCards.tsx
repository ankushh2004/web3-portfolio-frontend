"use client";

import { useState } from "react";
import { ArrowDownLeft } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Loader } from "../ui/Loader";
import { formatToUSD } from "@/utils/utils";
import type { TxLifecycle } from "@/types";
import { z } from "zod";

interface DepositCardProps {
  onDeposit: (amount: string) => void;
  status: TxLifecycle;
  walletBalance: string;
  ethPrice: number | undefined;
}

export function DepositCard({
  onDeposit,
  status,
  walletBalance,
  ethPrice,
}: DepositCardProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const maxDeposit = parseFloat(walletBalance) || 0;

  const depositSchema = z
    .string()
    .min(1, "Enter an amount")
    .refine((val) => !isNaN(Number(val)), {
      message: "Enter a valid number",
    })
    .refine((val) => Number(val) > 0, {
      message: "Amount must be greater than 0",
    })
    .refine((val) => Number(val) <= maxDeposit, {
      message: `Insufficient balance. Max: ${maxDeposit.toFixed(6)} ETH`,
    });

  const isProcessing =
    !!status && status !== "confirmed" && status !== "failed";

  const usdPreview =
    amount && !isNaN(Number(amount)) && ethPrice != null
      ? formatToUSD(parseFloat(amount) * ethPrice)
      : null;

  const handleDeposit = () => {
    const result = depositSchema.safeParse(amount);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    onDeposit(amount);
  };

  return (
    <Card className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-success-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <ArrowDownLeft className="text-success h-4 w-4" />
        </div>
        <div>
          <p className="text-text-primary text-sm font-bold">Deposit ETH</p>
          <p className="text-text-subtle text-xs">Add funds to vault</p>
        </div>
      </div>

      {/* Amount input */}
      <div className="space-y-1.5">
        <Input
          label="Amount"
          placeholder="0.0000"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError(null);
          }}
          suffix="ETH"
          hint={
            usdPreview
              ? `≈ ${usdPreview}`
              : `Available: ${parseFloat(walletBalance).toFixed(4)} ETH (wallet)`
          }
        />
        {error && <p className="text-danger text-xs font-medium">{error}</p>}
      </div>

      {/* CTA */}
      <Button
        variant="success"
        size="lg"
        className="w-full"
        onClick={handleDeposit}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader size="sm" /> Processing…
          </>
        ) : (
          <>
            <ArrowDownLeft className="h-4 w-4" /> Deposit ETH
          </>
        )}
      </Button>
    </Card>
  );
}
