// src/hooks/useUserAccount.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { userAccountKeys } from "./queryKeys";
import type { ApiUserAccount, UpdateUserAccountRequest } from "./types";

export function useUserAccount() {
  return useQuery({
    queryKey: userAccountKeys.me(),
    queryFn: () => apiFetch<ApiUserAccount>("/users/me"),
  });
}

export function useUpdateUserAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserAccountRequest) =>
      apiFetch<ApiUserAccount>("/users/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(userAccountKeys.me(), data);
    },
  });
}
