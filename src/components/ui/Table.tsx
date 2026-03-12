import { type ReactNode } from "react";
import { cn } from "../../utils/utils";
// ─── Table shell ─────────────────────────────────────────────────────────────

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-160 border-collapse">{children}</table>
    </div>
  );
}

// ─── Head ─────────────────────────────────────────────────────────────────────

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-surface-alt border-border border-b">{children}</thead>
  );
}

// ─── Header cell ─────────────────────────────────────────────────────────────

interface ThProps {
  children?: ReactNode;
  className?: string;
}

export function Th({ children, className = "" }: ThProps) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left",
        "text-text-subtle text-[10px] font-bold tracking-widest uppercase",
        className,
      )}
    >
      {children}
    </th>
  );
}

// ─── Body ────────────────────────────────────────────────────────────────────

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

// ─── Row ─────────────────────────────────────────────────────────────────────

interface TrProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Tr({ children, className = "", onClick }: TrProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-background border-b",
        "transition-colors duration-100",
        "hover:bg-surface-raised",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </tr>
  );
}

// ─── Data cell ───────────────────────────────────────────────────────────────

interface TdProps {
  children?: ReactNode;
  className?: string;
}

export function Td({ children, className = "" }: TdProps) {
  return (
    <td className={cn("px-4 py-3.5 align-middle", className)}>{children}</td>
  );
}
