import { useThemeStore } from "@/stores/theme-store";
import { Moon, Sun } from "lucide-react";
import type { FC } from "react";
import { Button } from "./ui/button";

const ThemeToggle: FC<{ size?: number }> = (
  props: { size?: number } = { size: 15 },
) => {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 text-neutral-700 transition-all hover:scale-105 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      aria-label="Toggle theme"
    >
      <Sun
        size={props.size}
        className={`absolute transition-all duration-300 ${
          theme === "light" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
        }`}
      />
      <Moon
        size={props.size}
        className={`absolute transition-all duration-300 ${
          theme === "dark" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
        }`}
      />
    </Button>
  );
};

export default ThemeToggle;
