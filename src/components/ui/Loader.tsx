import { Loader2 } from "lucide-react";
import { cn } from "../../utils/utils";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

export function Loader({
  size = "sm",
  className = "",
}: {
  size?: Size;
  className?: string;
}) {
  return (
    <Loader2
      className={cn("text-accent animate-spin", SIZES[size], className)}
    />
  );
}
