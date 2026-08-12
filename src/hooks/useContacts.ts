"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { contactKeys } from "@/hooks/queryKeys";
import type { ApiContact } from "@/hooks/types";

/**
 * Fetch all contacts owned by the logged-in user.
 *
 * Query key: ["contacts"]
 */
export function useContacts() {
  return useQuery({
    queryKey: contactKeys.list(),
    queryFn: () => apiFetch<ApiContact[]>("/contacts"),
  });
}
