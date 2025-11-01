import { queryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { handleApi } from "@/lib/utils/base";
import {
  deleteDeploymentDeploymentsDeploymentIdDelete,
  getDeploymentDeploymentsDeploymentIdGet,
  getDeploymentStatsDeploymentsDeploymentIdStatsGet,
  listDeploymentsDeploymentsGet,
  stopDeploymentDeploymentsDeploymentIdStartPost,
  stopDeploymentDeploymentsDeploymentIdStopPost,
  type BodyListDeploymentsDeploymentsGet,
  type DeploymentResponse,
  type ListDeploymentsDeploymentsGetParams,
  type PaginatedResponseDeploymentResponse,
} from "@/openapi";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useDeploymentsQuery(
  params: ListDeploymentsDeploymentsGetParams &
    BodyListDeploymentsDeploymentsGet,
) {
  return useQuery<PaginatedResponseDeploymentResponse>({
    queryKey: queryKeys.deployments(params),
    queryFn: async () =>
      handleApi(
        await listDeploymentsDeploymentsGet(
          { status: params.status, platform: params.platform },
          params,
        ),
      ),
    enabled: !!params.page,
  });
}

export function useDeploymentQuery(deploymentId?: string) {
  return useQuery<DeploymentResponse>({
    queryKey: queryKeys.deployment(deploymentId || "placeholder"),
    queryFn: async () =>
      handleApi(await getDeploymentDeploymentsDeploymentIdGet(deploymentId!)),
    enabled: !!deploymentId,
  });
}

export function useDeleteDeploymentMutation() {
  return useMutation({
    mutationFn: async (deploymentId: string) =>
      handleApi(
        await deleteDeploymentDeploymentsDeploymentIdDelete(deploymentId),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deployments() });
    },
  });
}

export function useDeploymentStatsQuery(deploymentId: string) {
  return useQuery({
    queryKey: queryKeys.deploymentStats(deploymentId),
    queryFn: async () =>
      handleApi(
        await getDeploymentStatsDeploymentsDeploymentIdStatsGet(deploymentId!),
      ),
    enabled: !!deploymentId,
  });
}

export function useStartDeploymentMutation() {
  return useMutation({
    mutationFn: async (deploymentId: string) => {
      return handleApi(
        await stopDeploymentDeploymentsDeploymentIdStartPost(deploymentId),
      );
    },
    onSuccess: (_, deploymentId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deployments() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.deployment(deploymentId),
      });
    },
  });
}

export function useStopDeploymentMutation() {
  return useMutation({
    mutationFn: async (deploymentId: string) => {
      return handleApi(
        await stopDeploymentDeploymentsDeploymentIdStopPost(deploymentId),
      );
    },
    onSuccess: (_, deploymentId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deployments() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.deployment(deploymentId),
      });
    },
  });
}