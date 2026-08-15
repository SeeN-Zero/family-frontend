import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import {
  accountKeys,
  familyKeys,
  loanKeys,
  transactionKeys,
} from "./queryKeys";
import type {
  ApiAccountSummary,
  ApiFamilyBalanceSummary,
  ApiLoanSummary,
  ApiFamilyMember,
  ApiPage,
  ApiTransaction,
} from "./types";

// Account Summary
export function useAccountSummary() {
  return useQuery({
    queryKey: accountKeys.summary(),
    queryFn: () => apiFetch<ApiAccountSummary>("/accounts/summary"),
  });
}

// Family Balance Summary
export function useFamilyBalanceSummary() {
  return useQuery({
    queryKey: familyKeys.balanceSummary(),
    queryFn: () => apiFetch<ApiFamilyBalanceSummary>("/family/balance-summary"),
    retry: false, // Don't retry if user is not FATHER/MOTHER or not in family
  });
}

// Loan Summary
export function useLoanSummary() {
  return useQuery({
    queryKey: loanKeys.summary(),
    queryFn: () => apiFetch<ApiLoanSummary>("/loans/summary"),
  });
}

// Family Members (for dashboard) — same key as the settings roster so both
// share one cache entry.
export function useFamilyMembersForDashboard() {
  return useQuery({
    queryKey: familyKeys.members(),
    queryFn: () => apiFetch<ApiFamilyMember[]>("/family/members"),
    retry: false, // Don't retry if user is not in family
  });
}

// Recent Transactions
export function useRecentTransactions() {
  return useQuery({
    queryKey: transactionKeys.recent(),
    queryFn: () =>
      apiFetch<ApiPage<ApiTransaction>>("/transactions?page=0&size=5"),
  });
}
