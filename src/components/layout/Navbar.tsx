"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Wallet, Globe, Check, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/Button";
import { showToast } from "../ui/Toast";
import { useAccount, useSwitchChain, useDisconnect } from "wagmi";
import { sepolia, mainnet } from "viem/chains";
import { logout } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const [dropOpen, setDropOpen] = useState(false);
  const [netOpen, setNetOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const { address, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { disconnectAsync } = useDisconnect();

  const dropRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
        setNetOpen(false);
      }
    };

    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Available networks to switch between
  const NETWORKS = [
    { label: "Sepolia", chain: sepolia },
    { label: "Ethereum Mainnet", chain: mainnet },
  ];

  const switchNetwork = async (chainId: number, label: string) => {
    try {
      await switchChainAsync({ chainId });
      setNetOpen(false);
      setDropOpen(false);
      showToast({
        type: "success",
        title: "Network Switched",
        description: `Connected to ${label}.`,
      });
    } catch {
      showToast({
        type: "error",
        title: "Network Switch Failed",
        description: "Please try again from MetaMask.",
      });
    }
  };

  // Handle wallet disconnect and logout
  const handleLogout = async () => {
    setDropOpen(false);
    try {
      await authService.logout();
      await disconnectAsync();
    } catch {
      showToast({
        type: "error",
        title: "Failed to Logout!",
      });
      return;
    }
    dispatch(logout());
    router.push("/");
    showToast({
      type: "info",
      title: "Logged Out!",
      description: "Wallet disconnected successfully",
    });
  };

  return (
    <header className="bg-background/80 border-border sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b px-4 backdrop-blur-xl lg:px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="text-text-muted h-5 w-5" />
      </Button>

      {/* Wallet dropdown */}
      <div ref={dropRef} className="relative ml-auto shrink-0">
        <button
          onClick={() => setDropOpen((v) => !v)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2",
            "bg-surface border transition-all duration-150",
            dropOpen
              ? "border-border-hover"
              : "border-border hover:border-border-hover",
          )}
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600">
            <Wallet className="h-3 w-3 text-white" />
          </div>

          <span className="text-text-secondary hidden font-mono text-xs sm:block">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>

          <span className="bg-success h-2 w-2 animate-pulse rounded-full shadow-[0_0_6px_var(--success)]" />

          <ChevronDown
            className={cn(
              "text-text-subtle h-3.5 w-3.5 transition-transform duration-200",
              dropOpen && "rotate-180",
            )}
          />
        </button>

        {dropOpen && (
          <div className="animate-slide-up bg-surface-alt border-border absolute top-[calc(100%+8px)] right-0 w-52 overflow-hidden rounded-2xl border shadow-(--shadow-modal)">
            {/* Wallet info */}
            <div className="border-border border-b px-4 py-3.5">
              <p className="text-text-subtle mb-1.5 text-[10px] font-bold tracking-widest uppercase">
                Connected
              </p>

              <p className="text-text-muted font-mono text-xs">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>

              <div className="mt-2 flex items-center gap-1.5">
                <span className="bg-success h-1.5 w-1.5 animate-pulse rounded-full" />
                <span className="text-success animate-pulse text-xs font-medium">
                  {chain?.name}
                </span>
              </div>
            </div>

            {/* Switch Network */}
            <div>
              <button
                onClick={() => setNetOpen((v) => !v)}
                className="text-text-muted hover:text-text-primary hover:bg-surface-raised flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              >
                <Globe className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left font-medium">
                  Switch Network
                </span>

                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    netOpen && "rotate-180",
                  )}
                />
              </button>

              {netOpen && (
                <div className="bg-background border-border border-t">
                  {NETWORKS.map(({ label, chain: c }) => (
                    <button
                      key={label}
                      onClick={() => switchNetwork(c.id, label)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-6 py-2.5 text-xs font-medium transition-colors",
                        chain?.id === c.id
                          ? "text-accent"
                          : "text-text-muted hover:bg-surface-alt hover:text-text-primary",
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          c.id === chain?.id ? "bg-warning" : "bg-blue-400",
                        )}
                      />

                      <span className="flex-1 text-left">{label}</span>

                      {chain?.id === c.id && <Check className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Disconnect */}
            <div className="border-border border-t">
              <button
                onClick={handleLogout}
                className="text-danger hover:bg-danger-muted flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
