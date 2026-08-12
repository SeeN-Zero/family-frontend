"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { loanKeys } from "@/hooks/queryKeys";
import type { ApiLoan, ApiPage, LoanFilter } from "@/hooks/types";

/**
 * Fetch a paginated list of loans (debt/receivable) with optional filters.
 *
 * Query key: ["loans", { contactId, status, loanType, page, size, ... }]
 */
export function useLoans(filters: LoanFilter = {}) {
  const queryKey = loanKeys.list(filters);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.accountId) params.set("accountId", filters.accountId);
      if (filters.contactId) params.set("contactId", filters.contactId);
      if (filters.loanType) params.set("loanType", filters.loanType);
      if (filters.status) params.set("status", filters.status);
      if (filters.dueDateFrom) params.set("dueDateFrom", filters.dueDateFrom);
      if (filters.dueDateTo) params.set("dueDateTo", filters.dueDateTo);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortDir) params.set("sortDir", filters.sortDir);
      params.set("page", String(filters.page ?? 0));
      params.set("size", String(filters.size ?? 20));
      return apiFetch<ApiPage<ApiLoan>>(`/loans?${params.toString()}`);
    },
  });
}
