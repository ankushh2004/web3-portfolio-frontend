"use client";

import { Profiler, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Loader } from "../ui/Loader";
import { formatToUSD } from "@/utils/utils";
import type { TxLifecycle } from "@/types";
import { z } from "zod";

interface WithdrawCardProps {
  onWithdraw: (amount: string) => void;
  status: TxLifecycle;
  vaultBalance: string;
  ethPrice: number | undefined;
}

export function WithdrawCard({
  onWithdraw,
  status,
  vaultBalance,
  ethPrice,
}: WithdrawCardProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const maxWithdraw = parseFloat(vaultBalance) || 0;

  const withdrawSchema = z
    .string()
    .min(1, "Enter an amount")
    .refine((val) => !isNaN(Number(val)), {
      message: "Enter a valid number",
    })
    .refine((val) => Number(val) > 0, {
      message: "Amount must be greater than 0",
    })
    .refine((val) => Number(val) <= maxWithdraw, {
      message: `Exceeds vault balance. Max: ${maxWithdraw.toFixed(4)} ETH`,
    });

  const isProcessing =
    !!status && status !== "confirmed" && status !== "failed";

  const usdPreview =
    amount && !isNaN(Number(amount)) && ethPrice != null
      ? formatToUSD(parseFloat(amount) * ethPrice)
      : null;

  const handleWithdraw = () => {
    const result = withdrawSchema.safeParse(amount);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    onWithdraw(amount);
  };

  return (
    <Card className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-danger-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <ArrowUpRight className="text-danger h-4 w-4" />
        </div>
        <div>
          <p className="text-text-primary text-sm font-bold">Withdraw ETH</p>
          <p className="text-text-subtle text-xs">Remove funds from vault</p>
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
              : `Available: ${parseFloat(vaultBalance).toFixed(4)} ETH (vault)`
          }
        />
        {error && <p className="text-danger text-xs font-medium">{error}</p>}
      </div>

      {/* CTA */}
      <Button
        variant="danger"
        size="lg"
        className="w-full"
        onClick={handleWithdraw}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader size="sm" /> Processing…
          </>
        ) : (
          <>
            <ArrowUpRight className="h-4 w-4" /> Withdraw ETH
          </>
        )}
      </Button>
    </Card>
  );
}
