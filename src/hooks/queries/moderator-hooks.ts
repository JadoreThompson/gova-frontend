import { queryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { handleApi } from "@/lib/utils/base";
import {
  createModeratorModeratorsPost,
  deleteModeratorModeratorsModeratorIdDelete,
  getModeratorModeratorsModeratorIdGet,
  getModeratorStatsModeratorsModeratorIdStatsGet,
  listModeratorActionsModeratorsModeratorIdActionsGet,
  listModeratorsModeratorsGet,
  startModeratorModeratorsModeratorIdStartPost,
  stopModeratorModeratorsModeratorIdStopPost,
  type ListModeratorActionsModeratorsModeratorIdActionsGetParams,
  type ListModeratorsModeratorsGetParams,
  type ModeratorCreate,
} from "@/openapi";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Fetches a paginated list of moderators.
 * @param params - Parameters for pagination and filtering.
 */
export function useModeratorsQuery(params: ListModeratorsModeratorsGetParams) {
  return useQuery({
    queryKey: queryKeys.moderators(params),
    queryFn: async () => handleApi(await listModeratorsModeratorsGet(params)),
  });
}

/**
 * Fetches a single moderator by its ID.
 * @param moderatorId - The ID of the moderator.
 */
export function useModeratorQuery(moderatorId: string) {
  return useQuery({
    queryKey: queryKeys.moderator(moderatorId),
    queryFn: async () =>
      handleApi(await getModeratorModeratorsModeratorIdGet(moderatorId)),
    enabled: !!moderatorId,
  });
}

/**
 * Fetches statistics for a single moderator.
 * @param moderatorId - The ID of the moderator.
 */
export function useModeratorStatsQuery(moderatorId: string) {
  return useQuery({
    queryKey: queryKeys.moderatorStats(moderatorId),
    queryFn: async () =>
      handleApi(
        await getModeratorStatsModeratorsModeratorIdStatsGet(moderatorId),
      ),
    enabled: !!moderatorId,
  });
}

/**
 * Fetches a paginated list of actions for a specific moderator.
 * @param moderatorId - The ID of the moderator.
 * @param params - Parameters for pagination.
 */
export function useModeratorActionsQuery(
  moderatorId: string,
  params: ListModeratorActionsModeratorsModeratorIdActionsGetParams,
) {
  return useQuery({
    queryKey: queryKeys.moderatorActions(moderatorId, params),
    queryFn: async () =>
      handleApi(
        await listModeratorActionsModeratorsModeratorIdActionsGet(
          moderatorId,
          params,
        ),
      ),
    enabled: !!moderatorId,
  });
}

/**
 * Creates a new moderator.
 * On success, invalidates the list of moderators.
 */
export function useCreateModeratorMutation() {
  return useMutation({
    mutationFn: async (data: ModeratorCreate) =>
      handleApi(await createModeratorModeratorsPost(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moderators() });
    },
  });
}

/**
 * Deletes a moderator.
 * On success, invalidates the list and removes the specific moderator's cache.
 */
export function useDeleteModeratorMutation() {
  return useMutation({
    mutationFn: async (moderatorId: string) =>
      handleApi(await deleteModeratorModeratorsModeratorIdDelete(moderatorId)),
    onSuccess: (_data, moderatorId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moderators() });
      queryClient.removeQueries({ queryKey: queryKeys.moderator(moderatorId) });
    },
  });
}

/**
 * Sends a request to start a moderator.
 * On success, invalidates data to reflect status changes.
 */
export function useStartModeratorMutation() {
  return useMutation({
    mutationFn: async (moderatorId: string) =>
      handleApi(
        await startModeratorModeratorsModeratorIdStartPost(moderatorId),
      ),
    onSuccess: (_data, moderatorId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moderators() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.moderator(moderatorId),
      });
    },
  });
}

/**
 * Sends a request to stop a moderator.
 * On success, invalidates data to reflect status changes.
 */
export function useStopModeratorMutation() {
  return useMutation({
    mutationFn: async (moderatorId: string) =>
      handleApi(await stopModeratorModeratorsModeratorIdStopPost(moderatorId)),
    onSuccess: (_data, moderatorId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moderators() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.moderator(moderatorId),
      });
    },
  });
}

export function useDeletModeratorMutation() {
  return useMutation({
    mutationFn: async (moderatorId: string) =>
      handleApi(await deleteModeratorModeratorsModeratorIdDelete(moderatorId)),
    onSuccess: (_data, moderatorId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.moderator(moderatorId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.moderatorStats(moderatorId),
      });
    },
  });
}
