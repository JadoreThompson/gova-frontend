import { useThemeStore } from "@/stores/theme-store";
import type { FC } from "react";

const SiteLogo: FC = () => {
  const theme = useThemeStore((state) => state.theme);

  if (theme === "dark") {
    return <img src="/src/assets/logo_white.png" alt="logo" />;
  }

  return <img src="/src/assets/logo_black.png" alt="logo" />;
};


export default SiteLogo;