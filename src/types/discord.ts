import type { MessagePlatform } from "@/openapi";

// Discord Action Types
export type DiscordActionType = "reply" | "kick" | "timeout";

// Discord Default Params
export interface DiscordDefaultParamsTimeout {
  duration?: number | null;
}

// Base Discord Action
export interface BaseDiscordAction {
  type: DiscordActionType;
  platform: MessagePlatform;
  requires_approval: boolean;
  default_params?: DiscordDefaultParamsTimeout | null;
}

// Specific Discord Actions
export interface DiscordActionReply
  extends Omit<BaseDiscordAction, "type" | "default_params"> {
  type: "reply";
  platform: "discord";
  default_params?: null;
}

export interface DiscordActionTimeout extends Omit<BaseDiscordAction, "type"> {
  type: "timeout";
  platform: "discord";
  default_params?: DiscordDefaultParamsTimeout | null;
}

export interface DiscordActionKick
  extends Omit<BaseDiscordAction, "type" | "default_params"> {
  type: "kick";
  platform: "discord";
  default_params?: null;
}

export type DiscordAction =
  | DiscordActionReply
  | DiscordActionTimeout
  | DiscordActionKick;

// Discord Moderator Config
export interface DiscordConfigBody {
  guild_id: string;
  channel_ids: string[];
  guild_summary: string;
  guidelines: string;
  actions: DiscordAction[];
  instructions?: string | null;
  [key: string]: unknown;
}
