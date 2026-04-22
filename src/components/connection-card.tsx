import { OAUTH2_URLS } from "@/lib/utils/utils";
import type { MessagePlatform } from "@/openapi";
import type { FC } from "react";
import MessagePlatformImg from "./message-platform-image";
import { Card, CardContent, CardFooter } from "./ui/card";

export const UnconnectedCard: FC<{ platform: MessagePlatform }> = (props) => {
  return (
    <Card className="relative h-50 w-50">
      <CardContent className="flex items-center justify-center">
        <MessagePlatformImg platform={props.platform} className="h-25 w-25" />
      </CardContent>
      <CardFooter>
        <a
          href={OAUTH2_URLS[props.platform]}
          target="_blank"
          type="button"
          className="w-full rounded-sm bg-white p-1 text-center text-black"
        >
          Connect
        </a>
      </CardFooter>
    </Card>
  );
};
