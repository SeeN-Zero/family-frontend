"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { transactionKeys } from "@/hooks/queryKeys";
import type {
  ApiPage,
  ApiTransaction,
  TransactionFilter,
} from "@/hooks/types";

/**
 * Fetch a paginated list of transactions with optional filters.
 *
 * Query key: ["transactions", { accountId, categoryId, dateFrom, dateTo, page, size }]
 */
export function useTransactions(
  filters: TransactionFilter = {},
  enabled = true
) {
  const queryKey = transactionKeys.list(filters);

  return useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.accountId) params.set("accountId", filters.accountId);
      if (filters.categoryId) params.set("categoryId", filters.categoryId);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      if (filters.page !== undefined) params.set("page", String(filters.page));
      if (filters.size !== undefined) params.set("size", String(filters.size));

      const query = params.toString();
      return apiFetch<ApiPage<ApiTransaction>>(
        query ? `/transactions?${query}` : "/transactions"
      );
    },
  });
}
