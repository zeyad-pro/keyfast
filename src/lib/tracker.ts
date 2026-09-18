export type Entry = {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
};

export type Settings = {
  startDate: string;
  goalDays: number;
  baselineWpm: number;
  baselineAccuracy: number;
};

const ENTRIES_KEY = "keyfast.entries.v1";
const SETTINGS_KEY = "keyfast.settings.v1";
const LANG_KEY = "keyfast.lang";

/* ---------- utils ---------- */
export const pad = (v: number) => String(v).padStart(2, "0");

export const toLocalDateString = (date: Date | number = new Date()) => {
  const d = typeof date === "number" ? new Date(date) : date;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const parseDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const dayDiff = (from: string, to: string) =>
  Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / 86400000);

export const formatDate = (value: string, lang: "en" | "ar" = "en") =>
  parseDate(value).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatShortDate = (value: string, lang: "en" | "ar" = "en") =>
  parseDate(value).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
  });

export const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/* ---------- settings ---------- */
export function defaultSettings(): Settings {
  return {
    startDate: toLocalDateString(),
    goalDays: 30,
    baselineWpm: 30,
    baselineAccuracy: 95,
  };
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultSettings(), ...(JSON.parse(raw) as Settings) };
  } catch {}
  return defaultSettings();
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {}
}

/* ---------- entries ---------- */
export function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Entry[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];

  // {
  //   id: makeId(),
  //   date: startDate,
  //   wpm: baselineWpm,
  //   accuracy: baselineAccuracy,
  // }
}

export function saveEntries(entries: Entry[]) {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {}
}

/* ---------- language ---------- */
export function loadLang(): "en" | "ar" {
  const v = localStorage.getItem(LANG_KEY);
  return v === "ar" ? "ar" : "en";
}
export function saveLang(lang: "en" | "ar") {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
}

/* ---------- streak ---------- */
export function computeStreak(days: number[]): number {
  if (!days.length) return 0;
  const sorted = [...days].sort((a, b) => a - b);
  let streak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    if (sorted[i] - sorted[i - 1] === 1) streak++;
    else break;
  }
  return streak;
}
