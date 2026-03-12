import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ----  Tailwind CSS classes with clsx and tailwind-merge ----
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---- Formatting utilities ----

export const formatToUSD = (value: number, decimals = 2): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
  }).format(value);

export const formatToPercentage = (value: number, decimals = 1): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
