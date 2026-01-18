import discordPNG from "@/assets/discord.png";
import type { MessagePlatform } from "@/openapi";
import type { FC } from "react";

const MessagePlatformImg: FC<{
  platform: MessagePlatform;
  className?: string;
}> = (props) => {
  const getSrc = (value: MessagePlatform): string => {
    switch (value) {
      case "discord":
        return discordPNG;
    }
  };

  return (
    <img
      src={getSrc(props.platform)}
      alt=""
      className={props.className ?? ""}
    />
  );
};

export default MessagePlatformImg;
