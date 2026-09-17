import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import {
  type Entry, type Settings,
  defaultSettings, loadEntries, loadLang, loadSettings,
  makeId, saveEntries, saveLang, saveSettings,
} from "../lib/tracker";
import { translations, type Lang, type Dict } from "../lib/i18n";
import { type Theme, loadTheme, saveTheme, applyTheme } from "../lib/theme";

type Ctx = {
  entries: Entry[];
  settings: Settings;
  lang: Lang;
  theme: Theme;
  t: Dict;
  addEntry: (e: Omit<Entry, "id">) => void;
  updateEntry: (id: string, e: Omit<Entry, "id">) => void;
  deleteEntry: (id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
  setLang: (l: Lang) => void;
  setTheme: (th: Theme) => void;
  toggleTheme: () => void;
  reset: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [entries, setEntries] = useState<Entry[]>(() => {
    const s = loadSettings();
    return loadEntries(s.startDate, s.baselineWpm, s.baselineAccuracy);
  });
  const [lang, setLangState] = useState<Lang>(() => loadLang());
  const [theme, setThemeState] = useState<Theme>(() => loadTheme());

  const t = translations[lang];

  // apply theme on mount + whenever it changes
  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  useEffect(() => { saveEntries(entries); }, [entries]);
  useEffect(() => { saveSettings(settings); }, [settings]);
  useEffect(() => {
    saveLang(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const addEntry = useCallback((e: Omit<Entry, "id">) => {
    setEntries((curr) => [...curr, { ...e, id: makeId() }]);
  }, []);

  const updateEntry = useCallback((id: string, e: Omit<Entry, "id">) => {
    setEntries((curr) => curr.map((x) => (x.id === id ? { ...e, id } : x)));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((curr) => curr.filter((x) => x.id !== id));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((curr) => ({ ...curr, ...patch }));
  }, []);

  const setTheme = useCallback((th: Theme) => {
    setThemeState(th);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((curr) => (curr === "dark" ? "light" : "dark"));
  }, []);

  const reset = useCallback(() => {
    const fresh = defaultSettings();
    setSettings(fresh);
    setEntries([{
      id: makeId(),
      date: fresh.startDate,
      wpm: fresh.baselineWpm,
      accuracy: fresh.baselineAccuracy,
    }]);
  }, []);

  const value = useMemo<Ctx>(() => ({
    entries, settings, lang, theme, t,
    addEntry, updateEntry, deleteEntry, updateSettings,
    setLang: setLangState, setTheme, toggleTheme, reset,
  }), [entries, settings, lang, theme, t, addEntry, updateEntry, deleteEntry, updateSettings, setTheme, toggleTheme, reset]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}