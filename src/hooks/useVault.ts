import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { formatEther, parseEther } from "viem";
import { ABI, CONTRACT_ADDRESS } from "@/constants/contract";
import { wagmiConfig } from "@/lib/wagmi";
import { setVaultData } from "@/store/slices/vaultSlice";
import { showToast } from "@/components/ui/Toast";
import type { TxLifecycle } from "@/types";
import { logActivity } from "@/services/activityService";
import {
  REFETCH_INTERVAL,
  STATUS_RESET_DELAY,
  USER_REJECTED_CODE,
} from "@/constants/constants";
// import { QueryClient } from "@tanstack/react-query";

interface WalletError {
  code?: number;
  shortMessage?: string;
  message?: string;
}

export function useVault() {
  const dispatch = useDispatch();
  const { address, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [depositStatus, setDepositStatus] = useState<TxLifecycle>(null);
  const [withdrawStatus, setWithdrawStatus] = useState<TxLifecycle>(null);

  // ── Contract reads ──
  const { data: depositedUserBalance, refetch: refetchUserBalance } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "getUserBalance",
      args: [address],
      query: { enabled: !!address, refetchInterval: REFETCH_INTERVAL },
    });

  const { data: totalDeposits, refetch: refetchTotalDeposits } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "totalDeposits",
      query: { refetchInterval: REFETCH_INTERVAL },
    });

  const { data: walletBalanceRaw, refetch: refetchWalletBalance } = useBalance({
    address,
    query: { enabled: !!address, refetchInterval: REFETCH_INTERVAL },
  });

  // ── Sync to Redux ──
  useEffect(() => {
    dispatch(
      setVaultData({
        userBalance: formatEther(
          (depositedUserBalance as bigint | undefined) ?? BigInt(0),
        ),
        totalDeposits: formatEther(
          (totalDeposits as bigint | undefined) ?? BigInt(0),
        ),
        walletBalance: formatEther(walletBalanceRaw?.value ?? BigInt(0)),
      }),
    );
  }, [depositedUserBalance, totalDeposits, walletBalanceRaw, dispatch]);

  // ── Refetch all ──
  const refetchAll = useCallback(() => {
    // QueryClient.invalidateQueries(["vault", "activity"]);
    refetchUserBalance();
    refetchTotalDeposits();
    refetchWalletBalance();
  }, [refetchUserBalance, refetchTotalDeposits, refetchWalletBalance]);

  // ── Deposit ──
  const deposit = useCallback(
    async (amount: string) => {
      try {
        setDepositStatus("signing");
        showToast({
          type: "info",
          title: "Awaiting Signature",
          description: "Confirm the deposit in your wallet.",
        });

        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: ABI,
          functionName: "deposit",
          value: parseEther(amount),
        });

        setDepositStatus("pending");
        showToast({
          type: "info",
          title: "Transaction Sent",
          description: "Waiting for block confirmation…",
        });

        const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });

        if (receipt.status === "success") {
          setDepositStatus("confirmed");
          showToast({
            type: "success",
            title: "Deposit Confirmed",
            description: `${amount} ETH deposited successfully.`,
          });

          if (address) {
            logActivity({ type: "Deposit", address, amount, txHash: hash });
          }
        } else {
          setDepositStatus("failed");
          showToast({
            type: "error",
            title: "Deposit Failed",
            description: "Transaction reverted on-chain.",
          });
        }

        refetchAll();
      } catch (err) {
        const error = err as WalletError;

        if (error?.code === USER_REJECTED_CODE) {
          showToast({
            type: "error",
            title: "Signature Rejected!",
            description: "You cancelled the transaction",
          });
        } else {
          showToast({
            type: "error",
            title: "Deposit Failed",
            description: error?.shortMessage || "Something went wrong.",
          });
        }

        setDepositStatus("failed");
      } finally {
        setTimeout(() => setDepositStatus(null), STATUS_RESET_DELAY);
      }
    },
    [writeContractAsync, refetchAll, address],
  );

  // ── Withdraw ──
  const withdraw = useCallback(
    async (amount: string) => {
      try {
        setWithdrawStatus("signing");
        showToast({
          type: "info",
          title: "Awaiting Signature!",
        });

        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: ABI,
          functionName: "withdraw",
          args: [parseEther(amount)],
        });

        setWithdrawStatus("pending");
        showToast({
          type: "info",
          title: "Transaction Sent",
          description: "Waiting for block confirmation…",
        });

        const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });

        if (receipt.status === "success") {
          setWithdrawStatus("confirmed");
          showToast({
            type: "success",
            title: "Withdrawal Confirmed",
            description: `${amount} ETH withdrawn successfully.`,
          });

          if (address) {
            logActivity({ type: "Withdraw", address, amount, txHash: hash });
          }
        } else {
          setWithdrawStatus("failed");
          showToast({
            type: "error",
            title: "Withdrawal Failed",
            description: "Transaction reverted on-chain.",
          });
        }

        refetchAll();
      } catch (err) {
        const error = err as WalletError;

        if (error?.code === USER_REJECTED_CODE) {
          showToast({
            type: "error",
            title: "Signature Rejected!",
            description: "You cancelled the transaction",
          });
        } else {
          showToast({
            type: "error",
            title: "Withdrawal Failed!",
            description: error?.shortMessage || "Something went wrong.",
          });
        }

        setWithdrawStatus("failed");
      } finally {
        setTimeout(() => setWithdrawStatus(null), STATUS_RESET_DELAY);
      }
    },
    [writeContractAsync, refetchAll, address],
  );

  return { deposit, withdraw, refetchAll, depositStatus, withdrawStatus };
}
