import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/utils";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "ghost"
  | "outline";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

// ── All color values come from CSS variables in globals.css ──────────────────

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent hover:bg-accent-hover text-white " +
    "shadow-[var(--shadow-accent)]",

  secondary:
    "bg-surface-raised hover:bg-surface-raised text-text-primary " +
    "border border-border hover:border-border-hover",

  danger:
    "bg-danger-muted hover:opacity-80 text-danger " +
    "border border-danger-border",

  success:
    "bg-success-muted hover:opacity-80 text-success " +
    "border border-success-border",

  ghost:
    "hover:bg-white/[0.04] text-text-muted hover:text-text-primary " +
    "border border-transparent",

  outline:
    "border border-border hover:border-border-hover " +
    "text-text-muted hover:text-text-primary hover:bg-surface-raised",
};

const SIZES: Record<ButtonSize, string> = {
  xs: "text-xs px-2.5 py-1.5",
  sm: "text-xs px-3 py-2",
  md: "text-sm px-4 py-2.5",
  lg: "text-sm px-5 py-3",
  xl: "text-[15px] px-6 py-3.5",
  icon: "p-2",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "cursor-pointer rounded-xl font-semibold select-none",
        "transition-all duration-150",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
