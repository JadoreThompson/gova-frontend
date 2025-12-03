import { queryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { handleApi } from "@/lib/utils/base";
import {
  deleteConnectionConnectionsPlatformDelete,
  getDiscordChannelsConnectionsDiscordGuildIdChannelsGet,
  getOwnedDiscordGuildsConnectionsDiscordGuildsGet,
  MessagePlatformType,
  type Guild,
  type GuildChannel,
} from "@/openapi";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useOwnedDiscordGuildsQuery() {
  return useQuery<Guild[]>({
    queryKey: queryKeys.discordGuilds(),
    queryFn: async () =>
      handleApi(await getOwnedDiscordGuildsConnectionsDiscordGuildsGet()),
  });
}

export function useDiscordChannelsQuery(guildId: string) {
  return useQuery<GuildChannel[]>({
    queryKey: queryKeys.discordGuildChannels(),
    queryFn: async () =>
      handleApi(
        await getDiscordChannelsConnectionsDiscordGuildIdChannelsGet(guildId),
      ),
    retry: false
  });
}

export function useDeleteConnectionMutation() {
  return useMutation({
    mutationFn: async (platform: MessagePlatformType) =>
      handleApi(await deleteConnectionConnectionsPlatformDelete(platform)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.me() }),
  });
}
