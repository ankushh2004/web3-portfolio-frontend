import { Badge, type BadgeVariant } from "./Badge";

type TxStatus = "Confirmed" | "Pending" | "Failed";

const MAP: Record<TxStatus, [BadgeVariant, string]> = {
  Confirmed: ["success", "Confirmed"],
  Pending: ["warning", "Pending"],
  Failed: ["error", "Failed"],
};

export function StatusBadge({ status }: { status: TxStatus }) {
  const [variant, label] = MAP[status] ?? MAP.Pending;
  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  );
}
