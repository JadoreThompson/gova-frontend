import { queryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { handleApi } from "@/lib/utils/base";
import {
    deleteDeploymentDeploymentsDeploymentIdDelete,
    getDeploymentDeploymentsDeploymentIdGet,
    listDeploymentsDeploymentsGet,
    updateDeploymentDeploymentsDeploymentIdPut,
    type DeploymentResponse,
    type DeploymentUpdate,
    type ListDeploymentsDeploymentsGetParams,
    type PaginatedResponseDeploymentResponse,
} from "@/openapi";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";


export function useDeploymentsQuery(
  params: ListDeploymentsDeploymentsGetParams,
) {
  return useQuery<PaginatedResponseDeploymentResponse>({
    queryKey: queryKeys.deployments(params),
    queryFn: async () => handleApi(await listDeploymentsDeploymentsGet(params)),
    enabled: !!params.page,
  });
}

export function useInfiniteDeploymentsQuery(
  params?: Omit<ListDeploymentsDeploymentsGetParams, "page">,
) {
  const baseKey = queryKeys.deployments(params);

  return useInfiniteQuery<PaginatedResponseDeploymentResponse>({
    queryKey: baseKey,
    queryFn: async ({ pageParam = 1 }) =>
      handleApi(
        await listDeploymentsDeploymentsGet({
          ...params,
          page: pageParam as number,
        }),
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.has_next) {
        return lastPage.page + 1;
      }
      return undefined;
    },
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

// --- Deployment Mutations ---

export function useUpdateDeploymentMutation() {
  return useMutation({
    mutationFn: async (params: {
      deploymentId: string;
      data: DeploymentUpdate;
    }) =>
      handleApi(
        await updateDeploymentDeploymentsDeploymentIdPut(
          params.deploymentId,
          params.data,
        ),
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deployments() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.deployment(variables.deploymentId),
      });
    },
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
