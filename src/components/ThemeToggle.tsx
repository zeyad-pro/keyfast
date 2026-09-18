import { Moon, Sun } from "lucide-react";
import { useApp } from "../context/AppContext";

export function ThemeToggle() {
  const { theme, toggleTheme, t } = useApp();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t.themeLight : t.themeDark}
      title={isDark ? t.themeLight : t.themeDark}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-(--kf-hairline) text-(--kf-body) transition-colors duration-150 hover:border-(--kf-ink)/30 hover:text-(--kf-ink)"
    >
      <span className="relative inline-block h-4 w-4">
        <Sun
          size={16}
          className={`absolute inset-0 transition-all duration-200 ${
            isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
        />
        <Moon
          size={16}
          className={`absolute inset-0 transition-all duration-200 ${
            isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}
