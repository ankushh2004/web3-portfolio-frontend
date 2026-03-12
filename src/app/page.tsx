"use client";

import { Layers, Wallet, AlertTriangle } from "lucide-react";
import { useAccount, useConnect, useSignMessage, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "viem/chains";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "@/store/slices/authSlice";
import authService from "@/services/authService";
import { showToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loader } from "@/components/ui/Loader";
import { useEffect, useState } from "react";

type WalletError = {
  code?: number;
  message?: string;
};

export default function LoginPage() {
  const { address, isConnected, chain } = useAccount();
  const { connectAsync, isPending: isConnecting } = useConnect();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const dispatch = useDispatch();
  const router = useRouter();

  // Check if user is connected to the wrong network (not Sepolia)
  const isWrongNetwork = isConnected && chain?.id !== sepolia.id;

  const [mounted, setMounted] = useState(false);

  // --- mounted before rendering to avoid hydration issues with wagmi ---
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // ── Connect Wallet ──
  const handleConnect = async () => {
    if (!window.ethereum) {
      showToast({
        type: "error",
        title: "Metamask wallet not detected",
      });
      return;
    }
    try {
      const result = await connectAsync({ connector: injected() });

      // Check if connected to wrong network
      if (result.chainId !== sepolia.id) {
        showToast({
          type: "warning",
          title: "Wrong Network Detected",
          description: "Please switch to Sepolia testnet to continue.",
        });
        return;
      }

      showToast({
        type: "success",
        title: "Wallet Connected!",
      });
    } catch (err) {
      const error = err as WalletError;

      if (error?.code === 4001) {
        showToast({
          type: "error",
          title: "Connection Rejected",
        });
        return;
      }
    }
  };

  // ── Switch to Sepolia ──
  const handleSwitchNetwork = async () => {
    try {
      await switchChainAsync({ chainId: sepolia.id });

      showToast({
        type: "success",
        title: "Network Switched to Sepolia!",
      });
    } catch (err) {
      const error = err as WalletError;

      if (error?.code === 4001) {
        showToast({
          type: "error",
          title: "Network Switch Rejected",
        });
        return;
      }

      showToast({
        type: "error",
        title: "Network Switch Failed",
      });
    }
  };

  // ── Sign Message & Authenticate ──
  const handleSign = async () => {
    if (!address) return;

    try {
      // 1. Fetch nonce from backend
      const nonce = await authService.fetchNonce(address);

      // 2. Build message & sign
      const message = [
        "Sign in to ChainBoard",
        "",
        `Address: ${address}`,
        `Nonce: ${nonce}`,
      ].join("\n");

      const signature = await signMessageAsync({ message });

      // 3. Verify on backend
      await authService.verifySignature(address, signature, message);

      // 4. Update store & redirect
      dispatch(login(address));

      showToast({
        type: "success",
        title: "Authenticated Successfully!",
      });
      router.push("/portfolio");
    } catch (err) {
      const error = err as WalletError;

      if (error?.code === 4001) {
        showToast({
          type: "error",
          title: "Signature Rejected!",
        });
        return;
      }

      showToast({
        type: "error",
        title: "Authentication Failed!",
      });
    }
  };
  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-5">
      {/* Ambient glow — left */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(99,102,241,0.07),transparent_60%)]" />
      {/* Ambient glow — right */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(139,92,246,0.05),transparent_60%)]" />
      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-size-[52px_52px] opacity-[0.18]" />

      <div className="relative z-10 w-full max-w-100">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-(--shadow-accent)">
            <Layers className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-text-primary mb-2 text-3xl font-bold tracking-tight">
            ChainBoard
          </h1>
          <p className="text-text-subtle text-sm">
            Your on-chain portfolio command center
          </p>
        </div>
        <Card className="p-7 shadow-(--shadow-modal)">
          {/* ── Not Connected ── */}
          {!isConnected && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-text-primary mb-1.5 text-[15px] font-bold">
                  Connect your wallet
                </p>
                <p className="text-text-muted text-xs leading-relaxed">
                  Connect a Web3 wallet to access your portfolio, manage vault
                  deposits, and track on-chain activity.
                </p>
              </div>

              <Button
                variant="primary"
                size="xl"
                className="w-full"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader size="sm" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                {isConnecting ? "Connecting…" : "Connect Wallet"}
              </Button>

              <p className="text-text-subtle text-center text-xs">
                Connect your Metamask wallet and ensure you are on the Sepolia
                test network.
              </p>
            </div>
          )}

          {/* ── Wrong Network ── */}
          {isWrongNetwork && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="bg-warning-muted border-warning-border mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border">
                  <AlertTriangle className="text-warning h-7 w-7" />
                </div>
                <p className="text-text-primary mb-1.5 text-[15px] font-bold">
                  Wrong Network
                </p>
                <p className="text-text-muted text-xs leading-relaxed">
                  ChainBoard works on Sepolia testnet. Please switch your
                  network to continue.
                </p>
              </div>

              <Button
                variant="primary"
                size="xl"
                className="w-full"
                onClick={handleSwitchNetwork}
              >
                Switch to Sepolia
              </Button>
            </div>
          )}

          {/* ── Connected & Correct Network ── */}
          {isConnected && !isWrongNetwork && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-text-primary mb-1.5 text-[15px] font-bold">
                  Wallet Connected
                </p>
                <p className="text-text-muted text-xs leading-relaxed">
                  Sign a message to verify ownership and access your dashboard.
                  This is gas-free and won&apos;t initiate a transaction.
                </p>
              </div>

              <div className="bg-surface-alt border-border rounded-xl border px-4 py-3">
                <p className="text-text-subtle mb-1.5 text-[10px] font-bold tracking-widest uppercase">
                  Connected Address
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-text-muted truncate font-mono text-xs">
                    {address}
                  </p>
                  <Badge variant="success" dot className="shrink-0">
                    Active
                  </Badge>
                </div>
              </div>

              <Button
                variant="primary"
                size="xl"
                className="w-full"
                onClick={handleSign}
                disabled={isSigning}
              >
                {isSigning ? (
                  <Loader size="sm" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                {isSigning ? "Signing…" : "Sign Message"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
