import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { familyKeys } from "@/hooks/queryKeys";
import type {
  ApiFamily,
  CreateFamilyRequest,
  JoinFamilyRequest,
} from "@/hooks/types";

export function useCreateFamily() {
  const queryClient = useQueryClient();
  return useMutation<ApiFamily, Error, CreateFamilyRequest>({
    mutationFn: (payload) =>
      apiFetch<ApiFamily>("/family", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
    },
  });
}

export function useJoinFamily() {
  const queryClient = useQueryClient();
  return useMutation<ApiFamily, Error, JoinFamilyRequest>({
    mutationFn: (payload) =>
      apiFetch<ApiFamily>("/family/join", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
    },
  });
}

export function useDeleteFamily() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (familyId) =>
      apiFetch<void>(`/family/${familyId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
    },
  });
}

export function useLeaveFamily() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () =>
      apiFetch<void>("/family/members/me", {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (memberId) =>
      apiFetch<void>(`/family/members/${memberId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.members() });
    },
  });
}
