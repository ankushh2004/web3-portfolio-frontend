import { type ReactNode } from "react";
import { cn } from "../../utils/utils";

export type BadgeVariant = "default" | "success" | "error" | "warning" | "info";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-white/5 text-text-muted border-border",
  success: "bg-success-muted text-success border-success-border",
  error: "bg-danger-muted text-danger border-danger-border",
  warning: "bg-warning-muted text-warning border-warning-border",
  info: "bg-accent-muted text-accent border-border-hover",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-text-muted",
  success: "bg-success shadow-[0_0_5px_var(--success)]",
  error: "bg-danger shadow-[0_0_5px_var(--danger)]",
  warning: "bg-warning shadow-[0_0_5px_var(--warning)]",
  info: "bg-accent",
};

export function Badge({
  children,
  variant = "default",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "rounded-full border px-2.5 py-1 text-xs font-semibold",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            DOT_CLASSES[variant],
          )}
        />
      )}
      {children}
    </span>
  );
}
