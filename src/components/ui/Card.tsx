import { type ReactNode } from "react";
import { cn } from "../../utils/utils";
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-surface border-border rounded-2xl border",
        hover && [
          "transition-all duration-150",
          "hover:bg-surface-raised",
          "hover:border-border-hover",
          "hover:-translate-y-px",
          "hover:shadow-(--shadow-card-hover)",
          onClick && "cursor-pointer",
        ],
        className,
      )}
    >
      {children}
    </div>
  );
}
