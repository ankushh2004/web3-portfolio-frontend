import { Card } from "../ui/Card";
import { cn } from "@/utils/utils";

interface VaultStatProps {
  label: string;
  value: string;
  sub: string;
  gradient: string;
  glowColor: string;
}

export function VaultStat({
  label,
  value,
  sub,
  gradient,
  glowColor,
}: VaultStatProps) {
  return (
    <Card className="relative overflow-hidden p-5">
      {/* Ambient glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-60 blur-xl",
          glowColor,
        )}
      />

      <p className="text-text-subtle mb-3 text-[10px] font-bold tracking-widest uppercase">
        {label}
      </p>
      <p className="text-text-primary mb-1 text-3xl font-bold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-text-muted text-xs">{sub}</p>

      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 h-0.5 bg-linear-to-r opacity-80",
          gradient,
        )}
      />
    </Card>
  );
}
