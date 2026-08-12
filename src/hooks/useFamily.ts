import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { familyKeys } from "@/hooks/queryKeys";
import type { ApiFamily, ApiFamilyMember } from "@/hooks/types";

export function useMyFamily() {
  return useQuery<ApiFamily | null>({
    queryKey: familyKeys.me(),
    queryFn: async () => {
      try {
        return await apiFetch<ApiFamily>("/family/me");
      } catch (error) {
        // 404 means user doesn't have a family yet
        if (error instanceof Error && error.message.includes("404")) {
          return null;
        }
        throw error;
      }
    },
  });
}

export function useFamilyMembers() {
  return useQuery<ApiFamilyMember[]>({
    queryKey: familyKeys.members(),
    queryFn: async () => {
      try {
        return await apiFetch<ApiFamilyMember[]>("/family/members");
      } catch (error) {
        // 404 means user doesn't have a family yet
        if (error instanceof Error && error.message.includes("404")) {
          return [];
        }
        throw error;
      }
    },
  });
}
