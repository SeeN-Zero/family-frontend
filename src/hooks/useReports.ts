"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { reportKeys } from "@/hooks/queryKeys";
import type {
  ApiCategoryBreakdown,
  ApiReportSummary,
  ApiTrendPoint,
  CategoryType,
} from "@/hooks/types";

type ReportFilter = {
  accountId?: string;
  dateFrom: string;
  dateTo: string;
};

/** GET /reports/summary — total income, expense, net untuk satu periode. */
export function useReportSummary(filter: ReportFilter) {
  return useQuery({
    queryKey: reportKeys.summary(filter),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.accountId) params.set("accountId", filter.accountId);
      params.set("dateFrom", filter.dateFrom);
      params.set("dateTo", filter.dateTo);
      return apiFetch<ApiReportSummary>(`/reports/summary?${params.toString()}`);
    },
  });
}

/** GET /reports/category-breakdown — total + tx count per kategori. */
export function useCategoryBreakdown(
  filter: ReportFilter & { type: CategoryType }
) {
  return useQuery({
    queryKey: reportKeys.categoryBreakdown(filter),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.accountId) params.set("accountId", filter.accountId);
      params.set("dateFrom", filter.dateFrom);
      params.set("dateTo", filter.dateTo);
      params.set("type", filter.type);
      return apiFetch<ApiCategoryBreakdown[]>(
        `/reports/category-breakdown?${params.toString()}`
      );
    },
  });
}

/**
 * POST /reports/trend — income/expense agregat untuk beberapa periode.
 * Key berdasarkan susunan `periods`, jadi dua periode identik → cache hit.
 */
export function useReportTrend(
  periods: { label: string; dateFrom: string; dateTo: string }[]
) {
  return useQuery({
    queryKey: reportKeys.trend(periods),
    enabled: periods.length > 0,
    queryFn: () =>
      apiFetch<ApiTrendPoint[]>("/reports/trend", {
        method: "POST",
        body: JSON.stringify({ periods }),
      }),
  });
}
