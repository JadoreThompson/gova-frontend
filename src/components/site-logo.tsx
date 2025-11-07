import { useThemeStore } from "@/stores/theme-store";
import type { FC } from "react";

import logoBlack from "@/assets/logo_black.png";
import logoWhite from "@/assets/logo_white.png";

const SiteLogo: FC<{ className?: string }> = (props) => {
  const theme = useThemeStore((state) => state.theme);
  const src = theme === "dark" ? logoWhite : logoBlack;

  return <img src={src} alt="Site Logo" className={props.className} />;
};

export default SiteLogo;