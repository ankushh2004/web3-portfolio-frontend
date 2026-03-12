"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useVault } from "@/hooks/useVault";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { formatToUSD } from "@/utils/utils";
import { VaultStat } from "@/components/vault/VaultStat";
import { DepositCard } from "@/components/vault/DepositCards";
import { WithdrawCard } from "@/components/vault/WithdrawCard";

function Vault() {
  const { deposit, withdraw, depositStatus, withdrawStatus } = useVault();
  const { getPrice } = useTokenPrices();
  const ethPrice = getPrice("ETH");
  const { userBalance, totalDeposits, walletBalance } = useSelector(
    (state: RootState) => state.vault,
  );

  const userBalanceNum = parseFloat(userBalance);
  const totalDepositsNum = parseFloat(totalDeposits);

  return (
    <div className="space-y-5 p-5 lg:p-7">
      {/* Heading */}
      <div>
        <h1 className="text-text-primary text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          Vault
        </h1>
        <p className="text-text-subtle text-xs">
          Manage vault deposits and withdrawals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <VaultStat
          label="Total Vault TVL"
          value={`${totalDepositsNum.toFixed(6)} ETH`}
          sub={
            ethPrice != null ? formatToUSD(totalDepositsNum * ethPrice) : "–"
          }
          gradient="from-violet-500 to-purple-500"
          glowColor="bg-emerald-500/10"
        />
        <VaultStat
          label="Your Vault Balance"
          value={`${userBalanceNum.toFixed(6)} ETH`}
          sub={ethPrice != null ? formatToUSD(userBalanceNum * ethPrice) : "–"}
          gradient="from-indigo-500 to-violet-500"
          glowColor="bg-indigo-500/10"
        />
      </div>

      {/* Deposit & Withdraw */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DepositCard
          onDeposit={deposit}
          status={depositStatus}
          walletBalance={walletBalance}
          ethPrice={ethPrice}
        />
        <WithdrawCard
          onWithdraw={withdraw}
          status={withdrawStatus}
          vaultBalance={userBalance}
          ethPrice={ethPrice}
        />
      </div>
    </div>
  );
}

export default Vault;
