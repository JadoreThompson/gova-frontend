import { useThemeStore } from "@/stores/theme-store";
import type { FC } from "react";

const SiteLogo: FC<{className?: string}> = (props) => {
  const theme = useThemeStore((state) => state.theme);
  const src = theme === "dark" ? "/src/assets/logo_white.png" : "/src/assets/logo_black.png";
  return <img src={src} alt="Site Logo" className={props.className} />;
};


export default SiteLogo;