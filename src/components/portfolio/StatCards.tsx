import { Card } from "@/components/ui/Card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/utils/utils";

interface StatCardProps {
  label:       string;
  value:       string;
  subValue:    string;
  icon:        LucideIcon;
  iconClass:   string;
  iconBgClass: string;
  glowClass:   string;
  accentLine:  string;
}

export function StatCard({
  label, value, subValue,
  icon: Icon, iconClass, iconBgClass, glowClass, accentLine,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden p-3 sm:p-4">
      <div className={cn("pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full", glowClass)} />

      <div className="mb-2 flex items-center gap-1.5">
        <div className={cn("hidden sm:flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", iconBgClass)}>
          <Icon className={cn("h-3 w-3", iconClass)} />
        </div>
        <p className="text-text-muted truncate text-xs font-semibold sm:text-[11px] sm:font-bold sm:tracking-widest sm:uppercase">
          {label}
        </p>
      </div>

      <p className="text-text-primary mb-0.5 truncate text-sm font-bold tracking-tight tabular-nums sm:text-base lg:text-lg">
        {value}
      </p>

      <p className="text-text-subtle truncate text-[10px] sm:text-[11px]">
        {subValue}
      </p>

      <div className={cn("absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r opacity-80", accentLine)} />
    </Card>
  );
}