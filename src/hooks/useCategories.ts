"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { categoryKeys } from "@/hooks/queryKeys";
import type { ApiCategory, CategoryType } from "@/hooks/types";

/**
 * Fetch categories, optionally filtered by type, archived status, and system flag.
 *
 * Query key: ["categories", type, includeArchived, includeSystem] — cache-nya
 * granular per kombinasi filter.
 */
export function useCategories(
  type?: CategoryType,
  includeArchived?: boolean,
  includeSystem?: boolean
) {
  return useQuery({
    queryKey: categoryKeys.list(type, includeArchived, includeSystem),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      params.set("includeArchived", String(includeArchived ?? false));
      params.set("includeSystem", String(includeSystem ?? true));
      return apiFetch<ApiCategory[]>(`/categories?${params.toString()}`);
    },
  });
}
