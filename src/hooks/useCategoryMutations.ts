"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { categoryKeys, transactionKeys } from "@/hooks/queryKeys";
import type {
  ApiCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/hooks/types";

/**
 * POST /categories — buat kategori baru.
 * Setelah sukses, invalidate semua query categories supaya list auto-refresh.
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) =>
      apiFetch<ApiCategory>("/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

/**
 * PUT /categories/{categoryId} — perbarui kategori (termasuk arsip/unarsip).
 * Kategori di-denormalisasi ke list transaksi, jadi invalidate juga transactions.
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: UpdateCategoryRequest;
    }) =>
      apiFetch<ApiCategory>(`/categories/${categoryId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.categoryId),
      });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

/**
 * DELETE /categories/{categoryId} — hapus kategori.
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      apiFetch<void>(`/categories/${categoryId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
