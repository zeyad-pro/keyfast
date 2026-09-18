import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type Entry,
  type Settings,
  defaultSettings,
  loadEntries,
  loadLang,
  loadSettings,
  makeId,
  saveEntries,
  saveLang,
  saveSettings,
} from "../lib/tracker";
import { translations, type Lang, type Dict } from "../lib/i18n";
import { type Theme, loadTheme, saveTheme, applyTheme } from "../lib/theme";

export type ToastType = "success" | "error" | "info";
export type ToastItem = { id: string; type: ToastType; message: string };

type Ctx = {
  entries: Entry[];
  settings: Settings;
  lang: Lang;
  theme: Theme;
  t: Dict;
  toasts: ToastItem[];
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
  };
  dismissToast: (id: string) => void;
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
  const [entries, setEntries] = useState<Entry[]>(() => loadEntries());
  const [lang, setLangState] = useState<Lang>(() => loadLang());
  const [theme, setThemeState] = useState<Theme>(() => loadTheme());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const t = translations[lang];

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);
  useEffect(() => {
    saveLang(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const dismissToast = useCallback((id: string) => {
    setToasts((curr) => curr.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback((type: ToastType, message: string) => {
    const id = makeId();
    setToasts((curr) => [...curr, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((curr) => curr.filter((x) => x.id !== id));
    }, 3600);
  }, []);

  const toast = useMemo(
    () => ({
      success: (msg: string) => pushToast("success", msg),
      error: (msg: string) => pushToast("error", msg),
      info: (msg: string) => pushToast("info", msg),
    }),
    [pushToast],
  );

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((curr) => ({ ...curr, ...patch }));
  }, []);

  const addEntry = useCallback(
    (e: Omit<Entry, "id">) => {
      setEntries((curr) => {
        const next = [...curr, { ...e, id: makeId() }];
        if (curr.length === 0) {
          setSettings((s) => ({ ...s, startDate: e.date }));
        } else if (e.date < settings.startDate) {
          setSettings((s) => ({ ...s, startDate: e.date }));
        }
        return next;
      });
    },
    [settings.startDate],
  );

  const updateEntry = useCallback((id: string, e: Omit<Entry, "id">) => {
    setEntries((curr) => curr.map((x) => (x.id === id ? { ...e, id } : x)));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((curr) => curr.filter((x) => x.id !== id));
  }, []);

  const setTheme = useCallback((th: Theme) => setThemeState(th), []);
  const toggleTheme = useCallback(() => {
    setThemeState((curr) => (curr === "dark" ? "light" : "dark"));
  }, []);

  const reset = useCallback(() => {
    const fresh = defaultSettings();
    setSettings(fresh);
    setEntries([]);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      entries,
      settings,
      lang,
      theme,
      t,
      toasts,
      toast,
      dismissToast,
      addEntry,
      updateEntry,
      deleteEntry,
      updateSettings,
      setLang: setLangState,
      setTheme,
      toggleTheme,
      reset,
    }),
    [
      entries,
      settings,
      lang,
      theme,
      t,
      toasts,
      toast,
      dismissToast,
      addEntry,
      updateEntry,
      deleteEntry,
      updateSettings,
      setTheme,
      toggleTheme,
      reset,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
