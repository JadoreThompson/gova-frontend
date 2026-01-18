import { queryClient } from "@/lib/query/query-client";
import { handleApi } from "@/lib/utils/base";
import {
  approveActionActionsActionIdApprovePost,
  rejectActionActionsActionIdRejectPost,
} from "@/openapi";
import { useMutation } from "@tanstack/react-query";

/**
 * Approves an action that is awaiting approval.
 * On success, invalidates the moderator actions list.
 */
export function useApproveActionMutation() {
  return useMutation({
    mutationFn: async (actionId: string) =>
      handleApi(await approveActionActionsActionIdApprovePost(actionId)),
    onSuccess: () => {
      // Invalidate all moderator actions queries
      queryClient.invalidateQueries({ queryKey: ["moderator"] });
    },
  });
}

/**
 * Rejects an action that is awaiting approval.
 * On success, invalidates the moderator actions list.
 */
export function useRejectActionMutation() {
  return useMutation({
    mutationFn: async (actionId: string) =>
      handleApi(await rejectActionActionsActionIdRejectPost(actionId)),
    onSuccess: () => {
      // Invalidate all moderator actions queries
      queryClient.invalidateQueries({ queryKey: ["moderator"] });
    },
  });
}
