import type { ModeratorUpdate } from "@/openapi";

/**
 * Generic moderator update type that allows specifying the config type.
 * This enables type-safe updates for different platform configurations.
 */
export interface ModeratorUpdateWithConfig<TConfig>
  extends Omit<ModeratorUpdate, "conf"> {
  conf?: TConfig | null;
}
