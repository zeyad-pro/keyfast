export type Theme = "dark" | "light";

const THEME_KEY = "keyfast.theme";

export function loadTheme(): Theme {
  const v = localStorage.getItem(THEME_KEY);
  return v === "light" ? "light" : "dark"; // default dark
}

export function saveTheme(theme: Theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}