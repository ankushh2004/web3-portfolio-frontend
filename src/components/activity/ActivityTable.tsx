import {
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  Activity as ActivityIcon,
} from "lucide-react";
import { Table, TableHead, TableBody, Th, Tr, Td } from "../ui/Table";
import { cn } from "../../utils/utils";
import { formatToUSD } from "../../utils/utils";
import type { Activity } from "@/types";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface ActivityTableProps {
  rows: Activity[];
  ethPrice: number | undefined;
}

export function ActivityTable({ rows, ethPrice }: ActivityTableProps) {
  if (rows.length === 0) {
    return (
      <div className="border-border bg-surface rounded-2xl border py-16 text-center">
        <ActivityIcon className="text-border mx-auto mb-3 h-10 w-10" />
        <p className="text-text-subtle text-sm">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface overflow-hidden rounded-2xl border">
      <Table>
        <TableHead>
          <tr>
            <Th className="w-10" />
            <Th>Asset</Th>
            <Th>Amount</Th>
            <Th>Tx Hash</Th>
            <Th className="text-right">Time</Th>
          </tr>
        </TableHead>

        <TableBody>
          {rows.map((tx) => {
            const usd =
              ethPrice != null
                ? formatToUSD(parseFloat(tx.amount) * ethPrice)
                : "–";

            return (
              <Tr key={tx.id}>
                {/* Type icon */}
                <Td>
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink items-center justify-center rounded-lg",
                      tx.type === "Deposit"
                        ? "bg-success-muted text-success"
                        : "bg-danger-muted text-danger",
                    )}
                  >
                    {tx.type === "Deposit" ? (
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                </Td>

                {/* Asset — vault sirf ETH support karta hai */}
                <Td>
                  <span className="text-text-muted text-sm font-semibold">
                    ETH
                  </span>
                </Td>

                {/* Amount + live USD */}
                <Td>
                  <p className="text-text-primary font-mono text-sm tabular-nums">
                    {parseFloat(tx.amount).toFixed(4)}
                  </p>
                  <p className="text-text-subtle text-xs">{usd}</p>
                </Td>

                {/* Hash */}
                <Td>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <span className="text-accent font-mono text-xs">
                      {tx.txHash.slice(0, 6)}…{tx.txHash.slice(-4)}
                    </span>
                    <ExternalLink className="text-text-subtle h-3 w-3" />
                  </a>
                </Td>

                {/* Time */}
                <Td className="text-right">
                  <span className="text-text-subtle text-xs">
                    {timeAgo(tx.timestamp)}
                  </span>
                </Td>
              </Tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
