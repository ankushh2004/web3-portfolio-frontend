import { cn } from "@/utils/utils";

interface AlertProps {
  variant: "warning" | "info";
  Icon: React.ElementType;
  title: string;
  description: string;
  bar?: { pct: number; warn: boolean };
}

export function Alert({ variant, Icon, title, description, bar }: AlertProps) {
  const isWarn = variant === "warning";

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border p-4",
        isWarn
          ? "bg-warning-muted border-warning-border"
          : "bg-accent-muted border-border-hover",
      )}
    >
      {/* Icon badge */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          isWarn ? "bg-warning-muted" : "bg-accent-muted",
        )}
      >
        <Icon
          className={cn("h-4 w-4", isWarn ? "text-warning" : "text-accent")}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "mb-1 text-sm font-semibold",
            isWarn ? "text-warning" : "text-accent",
          )}
        >
          {title}
        </p>
        <p className="text-text-muted mb-3 text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
