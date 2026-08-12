"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { accountKeys, loanKeys, transactionKeys } from "@/hooks/queryKeys";
import type {
  ApiAccount,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/hooks/types";

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountRequest) =>
      apiFetch<ApiAccount>("/accounts", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: string;
      payload: UpdateAccountRequest;
    }) =>
      apiFetch<ApiAccount>(`/accounts/${accountId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({
        queryKey: accountKeys.detail(variables.accountId),
      });
      // Saldo/account di-denormalisasi ke transaksi & pinjaman.
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) =>
      apiFetch<void>(`/accounts/${accountId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
    },
  });
}
