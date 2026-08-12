"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { accountKeys, loanKeys, loanPaymentKeys, transactionKeys } from "@/hooks/queryKeys";
import type {
  ApiLoan,
  ApiLoanPayment,
  CreateLoanPaymentRequest,
  CreateLoanRequest,
  UpdateLoanPaymentRequest,
} from "@/hooks/types";

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLoanRequest) =>
      apiFetch<ApiLoan>("/loans", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
      // Pinjaman otomatis membuat FinancialTransaction & mengubah saldo akun.
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loanId: string) =>
      apiFetch<void>(`/loans/${loanId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useCreateLoanPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      loanId,
      payload,
    }: {
      loanId: string;
      payload: CreateLoanPaymentRequest;
    }) =>
      apiFetch<ApiLoanPayment>(`/loans/${loanId}/payments`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
      queryClient.invalidateQueries({ queryKey: loanPaymentKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useUpdateLoanPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      loanId,
      paymentId,
      payload,
    }: {
      loanId: string;
      paymentId: string;
      payload: UpdateLoanPaymentRequest;
    }) =>
      apiFetch<ApiLoanPayment>(`/loans/${loanId}/payments/${paymentId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
      queryClient.invalidateQueries({ queryKey: loanPaymentKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useDeleteLoanPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ loanId, paymentId }: { loanId: string; paymentId: string }) =>
      apiFetch<void>(`/loans/${loanId}/payments/${paymentId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
      queryClient.invalidateQueries({ queryKey: loanPaymentKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
