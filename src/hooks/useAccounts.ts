"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { accountKeys } from "@/hooks/queryKeys";
import type { ApiAccount } from "@/hooks/types";

/**
 * Fetch all accounts owned by the logged-in user.
 *
 * Query key: ["accounts", includeArchived]
 */
export function useAccounts(includeArchived?: boolean) {
  return useQuery({
    queryKey: accountKeys.list(includeArchived),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("includeArchived", String(includeArchived ?? true));
      return apiFetch<ApiAccount[]>(`/accounts?${params.toString()}`);
    },
  });
}
