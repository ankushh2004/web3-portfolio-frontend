"use client";

import { useState, useEffect } from "react";
import {
  ActivityFilters,
  ACTIVITY_TYPE_FILTERS,
} from "@/components/activity/ActivityFilters";
import { ActivityTable } from "@/components/activity/ActivityTable";
import { Pagination } from "@/components/activity/Pagination";
import { useActivity } from "@/hooks/useActivity";
import { ActivityTypeFilter } from "@/types";
import { useTokenPrices } from "@/hooks/useTokenPrices";

const ACTIVITY_ROWS_PER_PAGE = 10;

function Activity() {
  const { activities, isLoading, isError } = useActivity();
  const { getPrice } = useTokenPrices();
  const ethPrice = getPrice("ETH");

  const [typeFilter, setTypeFilter] = useState<ActivityTypeFilter>(
    ACTIVITY_TYPE_FILTERS[0],
  );
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);

  // ── Filter by type ──
  const typeFiltered = activities.filter((tx) => {
    if (typeFilter.label === "Deposits") return tx.type === "Deposit";
    if (typeFilter.label === "Withdrawals") return tx.type === "Withdraw";
    return true;
  });

  // ── Page size cap ──
  const sizeFiltered =
    pageSize === Infinity ? typeFiltered : typeFiltered.slice(0, pageSize);

  // ── Pagination ──
  const totalPages = Math.max(
    1,
    Math.ceil(sizeFiltered.length / ACTIVITY_ROWS_PER_PAGE),
  );
  const paginated = sizeFiltered.slice(
    (page - 1) * ACTIVITY_ROWS_PER_PAGE,
    page * ACTIVITY_ROWS_PER_PAGE,
  );

  // Reset to page 1 whenever filter or size changes
  useEffect(() => {
    setPage(1);
  }, [typeFilter, pageSize]);

  return (
    <div className="space-y-5 p-5 lg:p-7">
      {/* Page heading */}
      <div>
        <h1 className="text-text-primary text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          Activity
        </h1>
        <p className="text-text-subtle text-xs">
          Transaction history and analytics
        </p>
      </div>

      <ActivityFilters
        typeFilter={typeFilter}
        pageSize={pageSize}
        totalShown={sizeFiltered.length}
        onTypeChange={setTypeFilter}
        onSizeChange={setPageSize}
      />

      <div className="border-border bg-surface overflow-hidden rounded-2xl border">
        {isLoading ? (
          <div className="py-16 text-center">
            <p className="text-text-subtle text-sm">Loading activity…</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center">
            <p className="text-danger text-sm">Failed to load activity.</p>
          </div>
        ) : (
          <>
            <ActivityTable rows={paginated} ethPrice={ethPrice} />
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
export default Activity;
