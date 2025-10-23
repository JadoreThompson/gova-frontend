import { MessagePlatformType } from "@/openapi";
import dayjs from "dayjs";

export const formatDate = (value: string) =>
  dayjs(value).format("YYYY-MM-DD HH:mm");

export const OAUTH2_URLS = {
  [MessagePlatformType.discord]:
    "https://discord.com/oauth2/authorize?client_id=1427581240772657152&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fdiscord%2Foauth&scope=identify",
} as const;
