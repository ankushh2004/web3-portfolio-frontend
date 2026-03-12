import { type InputHTMLAttributes } from "react";
import { cn } from "../../utils/utils";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  suffix?: string;
  className?: string;
}

export function Input({
  label,
  hint,
  suffix,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-text-subtle block text-[10px] font-bold tracking-widest uppercase">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          className={cn(
            "w-full rounded-xl px-4 py-3.5 outline-none",
            "bg-background border-border border",
            "text-text-primary font-mono text-lg",
            "placeholder:text-text-subtle",
            "transition-colors duration-150",
            "focus:border-accent focus:ring-accent-muted focus:ring-2",
            suffix && "pr-16",
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="text-accent pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold">
            {suffix}
          </span>
        )}
      </div>

      {hint && <p className="text-text-subtle text-xs">{hint}</p>}
    </div>
  );
}
