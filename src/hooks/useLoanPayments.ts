"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { loanPaymentKeys } from "@/hooks/queryKeys";
import type { ApiLoanPayment, ApiPage } from "@/hooks/types";

/**
 * Fetch paginated payments of a single loan.
 *
 * Query key: ["loans", "payments", loanId, { page, size }]
 * Dinonaktifkan selama `loanId` belum dipilih (panel pembayaran hanya terbuka
 * setelah user mengklik salah satu pinjaman).
 */
export function useLoanPayments(loanId?: string, size = 50) {
  return useQuery({
    queryKey: loanPaymentKeys.list(loanId ?? "", 0, size),
    enabled: Boolean(loanId),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", "0");
      params.set("size", String(size));
      return apiFetch<ApiPage<ApiLoanPayment>>(
        `/loans/${loanId}/payments?${params.toString()}`
      );
    },
  });
}
