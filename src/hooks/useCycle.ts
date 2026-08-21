// src/hooks/useCycle.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { cycleKeys } from "./queryKeys";
import type { ApiCycle, UpdateCycleRequest } from "./types";

/**
 * Cycle setting = hari (1-25) saat cycle bulanan pembukuan pengguna dimulai.
 * Server state dimiliki TanStack Query; query key ["cycle", "me"].
 */
export function useCycle() {
  return useQuery({
    queryKey: cycleKeys.me(),
    queryFn: () => apiFetch<ApiCycle>("/users/me/cycle"),
  });
}

export function useUpdateCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCycleRequest) =>
      apiFetch<ApiCycle>("/users/me/cycle", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(cycleKeys.me(), data);
    },
  });
}
