import { handleApi } from "@/lib/utils/base";
import {
  updateActionStatusActionsLogIdPatch,
  type ActionUpdate,
} from "@/openapi";
import { useMutation } from "@tanstack/react-query";

/**
 * Updates the status of a specific action (e.g., approve, decline).
 * On success, invalidates the actions list for the corresponding deployment.
 */
export function useUpdateActionStatusMutation() {
  return useMutation({
    mutationFn: async ({
      logId,
      data,
    }: {
      logId: string;
      data: ActionUpdate;
    }) => handleApi(await updateActionStatusActionsLogIdPatch(logId, data)),
  });
}
