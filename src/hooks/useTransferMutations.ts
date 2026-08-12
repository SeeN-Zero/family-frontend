"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { accountKeys, transactionKeys } from "@/hooks/queryKeys";
import type { CreateTransferRequest } from "@/hooks/types";

type ApiTransfer = {
  transferOutTransactionId: string;
  transferInTransactionId: string;
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  transactionDate: string;
};

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransferRequest) =>
      apiFetch<ApiTransfer>("/transfers", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useDeleteTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      apiFetch<void>(`/transfers/${transactionId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
