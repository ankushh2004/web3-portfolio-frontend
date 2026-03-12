"use client";

import {
  LayoutDashboard,
  Shield,
  Activity,
  Layers,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/portfolio", label: "Portfolio", Icon: LayoutDashboard },
  { href: "/vault", label: "Vault", Icon: Shield },
  { href: "/activity", label: "Activity", Icon: Activity },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-65 flex-col",
          "bg-background border-border border-r",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="border-border flex h-16 shrink-0 items-center gap-3 border-b px-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <span className="text-text-primary flex-1 truncate text-[15px] font-bold tracking-tight">
            ChainBoard
          </span>
          <button
            onClick={onClose}
            className="text-text-subtle hover:text-text-muted p-1 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-text-subtle mb-3 px-3 text-[10px] font-bold tracking-widest uppercase">
            Dashboard
          </p>

          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ href, label, Icon: NavIcon }) => {
              const active = pathname === href;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                      "relative border transition-all duration-150",
                      active
                        ? "bg-accent-muted text-accent border-accent-muted"
                        : "text-text-muted hover:text-text-secondary border-transparent hover:bg-white/4",
                    )}
                  >
                    {active && (
                      <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r bg-linear-to-b from-indigo-400 to-violet-500" />
                    )}

                    <NavIcon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-accent" : "text-text-subtle",
                      )}
                    />

                    <span className="flex-1 text-left">{label}</span>

                    {active && (
                      <span className="bg-accent h-1.5 w-1.5 rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
