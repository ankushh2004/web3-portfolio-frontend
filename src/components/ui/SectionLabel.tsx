import { type ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-text-subtle mb-4 text-[10px] font-bold tracking-widest uppercase">
      {children}
    </p>
  );
}
