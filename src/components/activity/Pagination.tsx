import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "../ui/Button";


interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  const maxVisible = 5;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  const end = Math.min(total, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="border-border bg-surface-alt flex items-center justify-between border-t px-5 py-3.5">
      <p className="text-text-subtle text-xs">
        Page {current} of {total}
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <Button
          variant="ghost"
          size="sm"
          disabled={current === 1}
          onClick={() => onChange(current - 1)}
          className="px-2"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={current === p ? "primary" : "ghost"}
            className={cn(
              "h-8 w-8 p-0 text-xs font-semibold",
              current !== p && "text-text-muted",
            )}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={current === p ? "page" : undefined}
          >
            {p}
          </Button>
        ))}

        {/* Next */}
        <Button
          variant="ghost"
          size="sm"
          disabled={current === total}
          onClick={() => onChange(current + 1)}
          className="px-2"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
