"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { contactKeys, loanKeys } from "@/hooks/queryKeys";
import type {
  ApiContact,
  CreateContactRequest,
  UpdateContactRequest,
} from "@/hooks/types";

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContactRequest) =>
      apiFetch<ApiContact>("/contacts", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contactId,
      payload,
    }: {
      contactId: string;
      payload: UpdateContactRequest;
    }) =>
      apiFetch<ApiContact>(`/contacts/${contactId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      queryClient.invalidateQueries({
        queryKey: contactKeys.detail(variables.contactId),
      });
      // Nama kontak di-denormalisasi ke list pinjaman.
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) =>
      apiFetch<void>(`/contacts/${contactId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
    },
  });
}
