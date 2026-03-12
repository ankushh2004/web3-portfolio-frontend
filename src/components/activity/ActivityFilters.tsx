"use client";

import { useState, useRef, useEffect, ComponentType } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/utils";
import { Activity, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { ActivityFiltersProps, ActivityPageSizeOption, ActivityTypeFilter } from "@/types";


export const ACTIVITY_TYPE_FILTERS: ActivityTypeFilter[] = [
  {
    label: "All Activity",
    icon: Activity,
  },
  {
    label: "Deposits",
    icon: ArrowDownLeft,
  },
  {
    label: "Withdrawals",
    icon: ArrowUpRight,
  },
];


export const ACTIVITY_PAGE_SIZES: ActivityPageSizeOption[] = [
  { label: "All Transactions", value: Infinity },
  { label: "Last 10 Transactions", value: 10 },
  { label: "Last 25 Transactions", value: 25 },
  { label: "Last 50 Transactions", value: 50 },
];

export function ActivityFilters({
  typeFilter,
  pageSize,
  onTypeChange,
  onSizeChange,
}: ActivityFiltersProps) {
  const [sizeOpen, setSizeOpen] = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);

  // Close size dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) {
        setSizeOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const currentSizeLabel =
    ACTIVITY_PAGE_SIZES.find((p) => p.value === pageSize)?.label ?? "Last 10";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2">
        {ACTIVITY_TYPE_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => onTypeChange(f)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
              typeFilter === f
                ? "bg-accent-muted text-accent border-border-hover"
                : "bg-surface text-text-muted border-border hover:border-border-hover hover:text-text-secondary",
            )}
          >
            <span className="flex items-center justify-center text-[13px] leading-none opacity-80">
              <f.icon className="h-3.5 w-3.5" />
            </span>

            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Page-size dropdown */}
      <div ref={sizeRef} className="relative">
        <button
          onClick={() => setSizeOpen((v) => !v)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium",
            "bg-surface text-text-muted transition-all",
            sizeOpen
              ? "border-border-hover"
              : "border-border hover:border-border-hover hover:text-text-secondary",
          )}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>{currentSizeLabel}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              sizeOpen && "rotate-180",
            )}
          />
        </button>

        {sizeOpen && (
          <div className="bg-surface-alt border-border animate-slide-up absolute top-[calc(100%+6px)] right-0 z-20 w-36 overflow-hidden rounded-xl border shadow-(--shadow-modal)">
            {ACTIVITY_PAGE_SIZES.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  onSizeChange(p.value);
                  setSizeOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors",
                  pageSize === p.value
                    ? "text-accent bg-accent-muted"
                    : "text-text-muted hover:bg-surface-raised hover:text-text-primary",
                )}
              >
                <span>{p.label}</span>
                {pageSize === p.value && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
