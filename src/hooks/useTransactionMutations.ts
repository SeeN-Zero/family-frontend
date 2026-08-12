"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { accountKeys, transactionKeys } from "@/hooks/queryKeys";
import type {
  ApiTransaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "@/hooks/types";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionRequest) =>
      apiFetch<ApiTransaction>("/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      // Transaksi mengubah saldo akun.
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: {
      transactionId: string;
      payload: UpdateTransactionRequest;
    }) =>
      apiFetch<ApiTransaction>(`/transactions/${transactionId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({
        queryKey: transactionKeys.detail(variables.transactionId),
      });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      apiFetch<void>(`/transactions/${transactionId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
