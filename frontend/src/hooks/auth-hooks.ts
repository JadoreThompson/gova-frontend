import { queryKeys } from "@/lib/query/query-keys";
import { handleApi } from "@/lib/utils/base";
import {
    discordCallbackAuthDiscordOauthGet,
    loginAuthLoginPost,
    registerAuthRegisterPost,
    type DiscordCallbackAuthDiscordOauthGetParams,
    type UserCreate,
    type UserLogin,
} from "@/openapi";
import {
    useMutation,
    useQuery,
} from "@tanstack/react-query";


export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: UserCreate) =>
      handleApi(await registerAuthRegisterPost(data)),
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: UserLogin) =>
      handleApi(await loginAuthLoginPost(data)),
  });
}


export function useDiscordCallbackQuery(
  params: DiscordCallbackAuthDiscordOauthGetParams, 
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.auth(),
    queryFn: async () =>
      handleApi(await discordCallbackAuthDiscordOauthGet(params)),
    enabled: enabled && !!params.code,
    staleTime: 0, 
    gcTime: 0,
  });
}