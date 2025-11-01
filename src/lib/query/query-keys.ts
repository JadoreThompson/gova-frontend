import {
  type ListGuidelinesGuidelinesGetParams,
  type ListModeratorActionsModeratorsModeratorIdActionsGetParams,
  type ListModeratorsModeratorsGetParams,
} from "@/openapi";

export const queryKeys = {
  // Auth
  auth: () => ["auth"] as const,
  me: () => ["me"] as const,

  // Connections
  discordGuilds: () => ["connections", "guilds"] as const,
  discordGuildChannels: () =>
    [...queryKeys.discordGuilds(), "channels"] as const,

  // Guidelines
  guidelines: (params?: ListGuidelinesGuidelinesGetParams) =>
    ["guidelines", params] as const,
  guideline: (guidelineId: string) =>
    [...queryKeys.guidelines(), guidelineId] as const,

  // Moderators
  moderators: (params?: ListModeratorsModeratorsGetParams) =>
    ["moderators", params] as const,
  moderator: (moderatorId: string) =>
    [...queryKeys.moderators(), moderatorId] as const,
  moderatorStats: (moderatorId: string) =>
    [...queryKeys.moderators(), "stats", moderatorId] as const,
  moderatorActions: (
    moderatorId: string,
    params?: ListModeratorActionsModeratorsModeratorIdActionsGetParams,
  ) => ["moderator", moderatorId, "actions", params] as const,
};
