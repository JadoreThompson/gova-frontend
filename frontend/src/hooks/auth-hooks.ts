import { queryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { handleApi } from "@/lib/utils/base";
import {
  discordCallbackAuthDiscordOauthGet,
  getMeAuthMeGet,
  loginAuthLoginPost,
  logoutAuthLogoutPost,
  type DiscordCallbackAuthDiscordOauthGetParams,
  type UpdatePassword,
  type UpdateUsername,
  type UserLogin,
} from "@/openapi";
import { useMutation, useQuery } from "@tanstack/react-query";

// TODO: Migrate
export function useRegisterMutation() {
  // return useMutation({
  //   mutationFn: async (data: UserCreate) =>
  //     handleApi(await registerAuthRegisterPost(data)),
  // });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: UserLogin) =>
      handleApi(await loginAuthLoginPost(data)),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => handleApi(await logoutAuthLogoutPost()),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useMeQuery() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: async () => handleApi(await getMeAuthMeGet()),
  });
}

export function useMeQueryAuthGuard() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: async () => handleApi(await getMeAuthMeGet()),
    retry: 1,
  });
}

export function useDiscordCallbackQuery(
  params: DiscordCallbackAuthDiscordOauthGetParams,
  enabled: boolean = true,
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

// TODO: Migrate
export function useUpdateUsernameMutation() {
  return useMutation({
    mutationFn: async (params: UpdateUsername) =>
      handleApi(await changeUsernameAuthChangeUsernamePatch(params)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.me() }),
  });
}

// TODO: Migrate
export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: async (params: UpdatePassword) =>
      handleApi(await changePasswordAuthChangePasswordPatch(params)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.me() }),
  });
}
