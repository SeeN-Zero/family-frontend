// Centralized query key definitions for TanStack Query.
//
// TanStack Query keys = "cache key" (analogi: key pada Map / @Cache lookup).
// Kombinasi key yang sama akan mengembalikan data yang sama tanpa re-fetch
// sampai dianggap stale, sehingga cache-nya granular per kombinasi filter,
// misalnya ["categories", "EXPENSE", true] vs ["categories", "EXPENSE", false]
// disimpan secara terpisah.
//
// Key `all` (mis. ["categories"]) adalah prefix/root. Memanggil
// queryClient.invalidateQueries({ queryKey: categoryKeys.all }) akan menandai
// SEMUA query categories (semua kombinasi filter) sebagai stale.

import type { CategoryType, LoanFilter, TransactionFilter } from "@/hooks/types";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (
    type?: CategoryType,
    includeArchived?: boolean,
    includeSystem?: boolean
  ) =>
    ["categories", type, includeArchived ?? false, includeSystem ?? true] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

export const accountKeys = {
  all: ["accounts"] as const,
  list: (includeArchived?: boolean) =>
    ["accounts", includeArchived ?? true] as const,
  detail: (id: string) => ["accounts", "detail", id] as const,
  summary: () => ["accounts", "summary"] as const,
};

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (filter: TransactionFilter) => ["transactions", filter] as const,
  detail: (id: string) => ["transactions", "detail", id] as const,
  recent: () => ["transactions", "recent"] as const,
};

export const contactKeys = {
  all: ["contacts"] as const,
  list: () => ["contacts"] as const,
  detail: (id: string) => ["contacts", "detail", id] as const,
};

export const loanKeys = {
  all: ["loans"] as const,
  list: (filter: LoanFilter) => ["loans", filter] as const,
  detail: (id: string) => ["loans", "detail", id] as const,
  summary: () => ["loans", "summary"] as const,
};

export const loanPaymentKeys = {
  all: ["loans", "payments"] as const,
  list: (loanId: string, page?: number, size?: number) =>
    ["loans", "payments", loanId, { page, size }] as const,
};

export const familyKeys = {
  all: ["family"] as const,
  me: () => ["family", "me"] as const,
  members: () => ["family", "members"] as const,
  balanceSummary: () => ["family", "balance-summary"] as const,
};

export const userAccountKeys = {
  all: ["userAccount"] as const,
  me: () => ["userAccount", "me"] as const,
};