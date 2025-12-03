import { MessagePlatformType } from "@/openapi";
import dayjs from "dayjs";

export const formatDate = (value: string) =>
  dayjs(value).format("YYYY-MM-DD HH:mm");

export const OAUTH2_URLS = {
  [MessagePlatformType.discord]:
    import.meta.env.VITE_DISCORD_OAUTH2_URL,
} as const;
