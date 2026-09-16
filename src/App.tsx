import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Edit3,
  Gauge,
  Keyboard,
  Languages,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Entry = {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
};

type FormState = {
  date: string;
  wpm: string;
  accuracy: string;
};

const STORAGE_KEY = "typetrack.entries.v1";
const START_KEY = "typetrack.startDate.v1";
const BASELINE_WPM = 26;
const TOTAL_DAYS = 30;

const translations = {
  en: {
    lab: "30 day typing lab", title: "Typing", titleMuted: "Progress", subtitle: "Track WPM and accuracy by real calendar date. Missing days stay missing.",
    reset: "Reset progress", current: "Current speed", max: "Max WPM", avg: "Average accuracy", completed: "Days completed",
    curve: "Performance curve", speedAccuracy: "Speed & accuracy", wpm: "WPM", accuracy: "Accuracy", day: "Day", baseline: "Baseline",
    daily: "Daily result", edit: "Edit result", log: "Log today's session", update: "Update your session", date: "Date", status: "Date status", calendar: "Calendar",
    speed: "Speed · WPM", speedPlaceholder: "e.g. 72", accuracyField: "Accuracy · %", accuracyPlaceholder: "e.g. 96.5",
    save: "Save changes", add: "Add result", note: "The day number is calculated from your first day. If you do not train on a date, no point is added to the chart.",
    history: "History", recorded: "Recorded days", csv: "CSV", json: "JSON", actions: "Actions", noDays: "No recorded days yet.",
    recent: "Show recent days", showAll: "Show all {n} days", footer1: "TypeTrack · 30 day lab", footer2: "Stored locally in your browser",
    resetConfirm: "Reset all progress and return to the 26 WPM baseline?", resetDone: "Progress reset.", saved: "Daily result saved.", updated: "Entry updated.", deleted: "Entry deleted.",
    invalidWpm: "Enter a valid WPM between 1 and 300.", invalidAccuracy: "Accuracy must be between 0 and 100%.", invalidDate: "The selected date must be inside the 30-day period.",
    duplicate: "This date already has an entry. Edit it from the table.", language: "العربية"
  },
  ar: {
    lab: "مختبر الكتابة — 30 يوم", title: "تقدم", titleMuted: "الكتابة", subtitle: "تابع سرعة الكتابة والدقة حسب التاريخ الفعلي. الأيام التي لم تتدرب فيها تظل فارغة.",
    reset: "إعادة ضبط التقدم", current: "السرعة الحالية", max: "أعلى سرعة", avg: "متوسط الدقة", completed: "الأيام المكتملة",
    curve: "منحنى الأداء", speedAccuracy: "السرعة والدقة", wpm: "WPM", accuracy: "الدقة", day: "اليوم", baseline: "خط الأساس",
    daily: "نتيجة اليوم", edit: "تعديل النتيجة", log: "سجل جلسة اليوم", update: "تحديث الجلسة", date: "التاريخ", status: "حالة التاريخ", calendar: "التقويم",
    speed: "السرعة · WPM", speedPlaceholder: "مثال: 72", accuracyField: "الدقة · %", accuracyPlaceholder: "مثال: 96.5",
    save: "حفظ التعديلات", add: "إضافة النتيجة", note: "يتم حساب رقم اليوم من أول تاريخ بدأت فيه. إذا لم تتدرب في يوم، لن تظهر نقطة له في الرسم البياني.",
    history: "السجل", recorded: "الأيام المسجلة", csv: "CSV", json: "JSON", actions: "الإجراءات", noDays: "لا توجد أيام مسجلة حتى الآن.",
    recent: "عرض الأيام الأخيرة", showAll: "عرض كل {n} يوم", footer1: "TypeTrack · مختبر 30 يوم", footer2: "يتم حفظ البيانات محليًا في المتصفح",
    resetConfirm: "هل تريد إعادة ضبط كل التقدم والعودة إلى خط أساس 26 WPM؟", resetDone: "تمت إعادة ضبط التقدم.", saved: "تم حفظ نتيجة اليوم.", updated: "تم تحديث النتيجة.", deleted: "تم حذف النتيجة.",
    invalidWpm: "أدخل سرعة صحيحة بين 1 و300 WPM.", invalidAccuracy: "يجب أن تكون الدقة بين 0 و100%.", invalidDate: "يجب أن يكون التاريخ داخل فترة الـ30 يومًا.",
    duplicate: "هذا التاريخ لديه نتيجة بالفعل. عدّلها من الجدول.", language: "English"
  }
} as const;

type Lang = keyof typeof translations;


const pad = (value: number) => String(value).padStart(2, "0");

const toLocalDateString = (date: Date | number = new Date()) => {
  const d = typeof date === "number" ? new Date(date) : date;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const parseDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const dayDiff = (from: string, to: string) =>
  Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / 86400000);

const formatDate = (value: string, lang: Lang = "en") =>
  parseDate(value).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

const formatShortDate = (value: string, lang: Lang = "en") =>
  parseDate(value).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short", day: "numeric",
  });

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function loadEntries(startDate: string): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Entry[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    // Ignore malformed localStorage data.
  }

  return [
    {
      id: makeId(),
      date: startDate,
      wpm: BASELINE_WPM,
      accuracy: 95,
    },
  ];
}

function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("typetrack.lang") as Lang) || "en");
  const t = translations[lang];

  const [startDate, setStartDate] = useState(
    () => localStorage.getItem(START_KEY) || toLocalDateString(),
  );
  const [entries, setEntries] = useState<Entry[]>(() => loadEntries(startDate));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState("");

  const today = toLocalDateString();

  const [form, setForm] = useState<FormState>(() => ({
    date: today,
    wpm: "",
    accuracy: "",
  }));

  useEffect(() => {
    localStorage.setItem("typetrack.lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    localStorage.setItem(START_KEY, startDate);
  }, [entries, startDate]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const selectedDay = Math.min(
    TOTAL_DAYS,
    Math.max(1, dayDiff(startDate, form.date) + 1),
  );

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries],
  );

  const chartData = useMemo(
    () =>
      sortedEntries
        .map((entry) => ({
          ...entry,
          day: dayDiff(startDate, entry.date) + 1,
          label: `Day ${dayDiff(startDate, entry.date) + 1}`,
        }))
        .filter((entry) => entry.day >= 1 && entry.day <= TOTAL_DAYS),
    [sortedEntries, startDate],
  );

  const stats = useMemo(() => {
    const valid = chartData;
    const current = valid.at(-1);
    const max = valid.reduce((highest, item) => Math.max(highest, item.wpm), BASELINE_WPM);
    const averageAccuracy = valid.length
      ? valid.reduce((sum, item) => sum + item.accuracy, 0) / valid.length
      : 0;

    return {
      current: current?.wpm ?? BASELINE_WPM,
      max,
      averageAccuracy,
      completed: valid.length,
    };
  }, [chartData]);

  const visibleEntries = showAll ? [...chartData].reverse() : [...chartData].reverse().slice(0, 7);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const wpm = Number(form.wpm);
    const accuracy = Number(form.accuracy);

    if (!form.date || !Number.isFinite(wpm) || wpm < 1 || wpm > 300) {
      setNotice(t.invalidWpm);
      return;
    }

    if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100) {
      setNotice(t.invalidAccuracy);
      return;
    }

    const offset = dayDiff(startDate, form.date);
    if (offset < 0 || offset >= TOTAL_DAYS) {
      setNotice(t.invalidDate);
      return;
    }

    const existing = entries.find((entry) => entry.date === form.date && entry.id !== editingId);

    if (existing) {
      setNotice(t.duplicate);
      return;
    }

    if (editingId) {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === editingId
            ? { ...entry, date: form.date, wpm, accuracy }
            : entry,
        ),
      );
      setNotice(t.updated);
    } else {
      setEntries((current) => [
        ...current,
        { id: makeId(), date: form.date, wpm, accuracy },
      ]);
      setNotice(t.saved);
    }

    setEditingId(null);
    setForm({ date: today, wpm: "", accuracy: "" });
  };

  const editEntry = (entry: Entry) => {
    setEditingId(entry.id);
    setForm({
      date: entry.date,
      wpm: String(entry.wpm),
      accuracy: String(entry.accuracy),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ date: today, wpm: "", accuracy: "" });
    }
    setNotice(t.deleted);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ date: today, wpm: "", accuracy: "" });
  };

  const exportFile = (type: "csv" | "json") => {
    const rows = [...chartData].sort((a, b) => a.day - b.day);

    let content = "";
    let mime = "";
    let extension = "";

    if (type === "json") {
      content = JSON.stringify(
        {
          startDate,
          baselineWpm: BASELINE_WPM,
          days: rows,
        },
        null,
        2,
      );
      mime = "application/json";
      extension = "json";
    } else {
      const header = "day,date,wpm,accuracy";
      const body = rows
        .map((row) => `${row.day},${row.date},${row.wpm},${row.accuracy}`)
        .join("\n");
      content = `${header}\n${body}`;
      mime = "text/csv;charset=utf-8";
      extension = "csv";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `typing-progress-${toLocalDateString()}.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetProgress = () => {
    const confirmed = window.confirm(t.resetConfirm);
    if (!confirmed) return;

    const freshStart = toLocalDateString();
    const baseline: Entry = {
      id: makeId(),
      date: freshStart,
      wpm: BASELINE_WPM,
      accuracy: 95,
    };

    setStartDate(freshStart);
    setEntries([baseline]);
    setEditingId(null);
    setForm({ date: freshStart, wpm: "", accuracy: "" });
    setNotice(t.resetDone);
  };

  return (
    <main className="min-h-screen bg-[#090b0b] text-[#f4f7f5]">
      <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/8 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#69df91]">
              <span className="dot-pulse h-1.5 w-1.5 rounded-full bg-[#69df91]" />
              {t.lab}
            </div>
            <h1 className="text-3xl font-light tracking-[-0.04em] sm:text-5xl">
              {t.title} <span className="text-white/70">{t.titleMuted}</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setLang((current) => (current === "en" ? "ar" : "en"))}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 px-4 text-xs text-white/80 transition hover:border-white/35 hover:text-white"
            >
              <Languages size={14} />
              {t.language}
            </button>
            <button
            onClick={resetProgress}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-full border border-white/12 px-4 text-xs text-white/80 transition hover:border-white/25 hover:text-white md:self-auto"
          >
            <RotateCcw size={14} />
            {t.reset}
          </button>
          </div>
        </header>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Zap size={17} />} label={t.current} value={`${stats.current}`} unit="WPM" accent="green" />
          <StatCard icon={<Trophy size={17} />} label={t.max} value={`${stats.max}`} unit="WPM" accent="violet" />
          <StatCard icon={<Activity size={17} />} label={t.avg} value={`${stats.averageAccuracy.toFixed(1)}`} unit="%" accent="green" />
          <StatCard icon={<CalendarDays size={17} />} label={t.completed} value={`${stats.completed}`} unit={`/ ${TOTAL_DAYS}`} accent="violet" />
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="min-w-0 border border-white/8 bg-[#0c0f0f]/90 p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">{t.curve}</p>
                <h2 className="mt-1 text-xl font-light">{t.speedAccuracy}</h2>
              </div>
              <div className="flex gap-4 text-[11px] text-white/70">
                <span className="inline-flex items-center gap-2">
                  <i className="h-1.5 w-5 rounded-full bg-[#B7B0FF]" />
                  {t.wpm}
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="h-1.5 w-5 rounded-full bg-[#6FFFA1]" />
                  {t.accuracy}
                </span>
              </div>
            </div>

            <div className="h-[330px] w-full sm:h-[370px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 8" />
                  <XAxis
                    dataKey="day"
                    type="number"
                    domain={[1, TOTAL_DAYS]}
                    ticks={Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1)}
                    tick={{ fill: "#B8C0C0", fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,.18)" }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <YAxis
                    yAxisId="wpm"
                    domain={[0, "auto"]}
                    tick={{ fill: "#B8C0C0", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="accuracy"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fill: "#B8C0C0", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<ChartTooltip t={t} />} />
                  <Legend content={() => null} />
                  <Line
                    yAxisId="wpm"
                    type="monotone"
                    dataKey="wpm"
                    stroke="#B7B0FF"
                    strokeWidth={2.2}
                    dot={{ r: 3.5, fill: "#B7B0FF", stroke: "#0c0f0f", strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                    connectNulls={false}
                    name={t.wpm}
                  />
                  <Line
                    yAxisId="accuracy"
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#6FFFA1"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#6FFFA1", stroke: "#0c0f0f", strokeWidth: 2 }}
                    activeDot={{ r: 4.5 }}
                    connectNulls={false}
                    name={t.accuracy}
                  />
                  {chartData.length > 0 && (
                    <Line
                      yAxisId="wpm"
                      type="monotone"
                      dataKey={() => BASELINE_WPM}
                      stroke="#D1A85A"
                      strokeDasharray="4 6"
                      strokeWidth={1}
                      dot={false}
                      name={t.baseline}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-white/7 pt-3 text-[10px] uppercase tracking-[0.15em] text-white/50">
              <span>{t.day} 1</span>
              <span>{t.baseline} {BASELINE_WPM} WPM</span>
              <span>{t.day} 30</span>
            </div>
          </div>

          <form onSubmit={submit} className="border border-white/8 bg-[#0c0f0f]/90 p-5 sm:p-6">
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                {editingId ? t.edit : t.daily}
              </p>
              <h2 className="mt-1 text-xl font-light">
                {editingId ? t.update : t.log}
              </h2>
            </div>

            <div className="space-y-4">
              <Field label={t.date}>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={15} />
                  <input
                    type="date"
                    value={form.date}
                    min={startDate}
                    max={toLocalDateString(parseDate(startDate).getTime() + 29 * 86400000)}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                    className="h-11 w-full border border-white/10 bg-[#090b0b] pl-10 pr-3 text-sm outline-none transition focus:border-[#58d68b]/60"
                  />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t.day}>
                  <div className="flex h-11 items-center justify-between border border-white/7 bg-white/[0.025] px-3">
                    <span className="text-sm">{selectedDay}</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/50">/ 30</span>
                  </div>
                </Field>
                <Field label={t.status}>
                  <div className="flex h-11 items-center gap-2 border border-white/7 bg-white/[0.025] px-3 text-[11px] text-[#6FFFA1]">
                    <Check size={14} />
                    {t.calendar}
                  </div>
                </Field>
              </div>

              <Field label={t.speed}>
                <div className="relative">
                  <Gauge className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={15} />
                  <input
                    type="number"
                    min="1"
                    max="300"
                    step="1"
                    placeholder={t.speedPlaceholder}
                    value={form.wpm}
                    onChange={(event) => setForm((current) => ({ ...current, wpm: event.target.value }))}
                    className="h-11 w-full border border-white/10 bg-[#090b0b] pl-10 pr-3 text-sm outline-none placeholder:text-white/45 focus:border-[#8b82ff]/70"
                  />
                </div>
              </Field>

              <Field label={t.accuracyField}>
                <div className="relative">
                  <Activity className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={15} />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder={t.accuracyPlaceholder}
                    value={form.accuracy}
                    onChange={(event) => setForm((current) => ({ ...current, accuracy: event.target.value }))}
                    className="h-11 w-full border border-white/10 bg-[#090b0b] pl-10 pr-3 text-sm outline-none placeholder:text-white/45 focus:border-[#58d68b]/70"
                  />
                </div>
              </Field>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-black transition hover:bg-white/85"
                >
                  {editingId ? <Check size={15} /> : <Zap size={15} />}
                  {editingId ? t.save : t.add}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="h-11 w-11 rounded-full border border-white/10 text-white/50 transition hover:border-white/25 hover:text-white"
                    aria-label="Cancel editing"
                  >
                    <X size={16} className="mx-auto" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-white/7 pt-4 text-[10px] leading-5 text-white/50">
              {t.note}
            </div>
          </form>
        </section>

        <section className="mt-6 border border-white/8 bg-[#0c0f0f]/90">
          <div className="flex flex-col gap-4 border-b border-white/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">{t.history}</p>
              <h2 className="mt-1 text-xl font-light">{t.recorded}</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => exportFile("csv")}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 px-3 text-[11px] text-white/60 transition hover:border-white/25 hover:text-white"
              >
                <Download size={13} />
                {t.csv}
              </button>
              <button
                onClick={() => exportFile("json")}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 px-3 text-[11px] text-white/60 transition hover:border-white/25 hover:text-white"
              >
                <Download size={13} />
                {t.json}
              </button>
            </div>
          </div>

          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-white/7 text-[10px] uppercase tracking-[0.16em] text-white/50">
                  <th className="px-5 py-3 font-normal sm:px-6">Day</th>
                  <th className="px-5 py-3 font-normal">Date</th>
                  <th className="px-5 py-3 font-normal">WPM</th>
                  <th className="px-5 py-3 font-normal">Accuracy</th>
                  <th className="px-5 py-3 text-right font-normal sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-white/6 text-sm last:border-0 hover:bg-white/[0.018]">
                    <td className="px-5 py-4 font-medium sm:px-6">
                      <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-white/[0.05] px-2 py-1 text-xs">
                        {dayDiff(startDate, entry.date) + 1}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/70">{formatDate(entry.date, lang)}</td>
                    <td className="px-5 py-4 text-[#a39cff]">{entry.wpm} <span className="text-[10px] text-white/50">WPM</span></td>
                    <td className="px-5 py-4 text-[#69df91]">{entry.accuracy}%</td>
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => editEntry(entry)}
                          className="rounded-full p-2 text-white/60 transition hover:bg-white/6 hover:text-white"
                          aria-label={`Edit ${formatDate(entry.date, lang)}`}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="rounded-full p-2 text-white/60 transition hover:bg-red-400/10 hover:text-red-300"
                          aria-label={`Delete ${formatDate(entry.date, lang)}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!visibleEntries.length && (
              <div className="flex min-h-36 flex-col items-center justify-center gap-2 text-white/50">
                <Keyboard size={22} />
                <p className="text-sm">{t.noDays}</p>
              </div>
            )}
          </div>

          {chartData.length > 7 && (
            <div className="border-t border-white/7 p-4 text-center">
              <button
                onClick={() => setShowAll((value) => !value)}
                className="inline-flex items-center gap-2 text-xs text-white/70 transition hover:text-white"
              >
                {showAll ? t.recent : t.showAll.replace("{n}", String(chartData.length))}
                <ChevronDown className={`transition ${showAll ? "rotate-180" : ""}`} size={14} />
              </button>
            </div>
          )}
        </section>

        <footer className="flex flex-col gap-2 py-8 text-[10px] uppercase tracking-[0.14em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>{t.footer1}</span>
          <span>{t.footer2}</span>
        </footer>
      </div>

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#171b1b]/95 px-4 py-3 text-xs text-white/75 backdrop-blur-md">
          <MoreHorizontal size={14} className="text-[#69df91]" />
          {notice}
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.17em] text-white/60">{label}</span>
      {children}
    </label>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  accent: "green" | "violet";
}) {
  return (
    <div className="border border-white/8 bg-[#0c0f0f]/90 p-4">
      <div className="mb-6 flex items-center justify-between text-white/60">
        <span className="text-[10px] uppercase tracking-[0.18em]">{label}</span>
        <span className={accent === "green" ? "text-[#6FFFA1]" : "text-[#B7B0FF]"}>{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <strong className="text-3xl font-light tracking-[-0.04em]">{value}</strong>
        <span className="pb-1 text-[10px] uppercase tracking-[0.16em] text-white/50">{unit}</span>
      </div>
    </div>
  );
}

function ChartTooltip({
  t,
  active,
  payload,
  label,
}: {
  t: typeof translations[Lang];
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border border-white/10 bg-[#121616]/95 px-3 py-2 text-xs backdrop-blur-md">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-white/60">{t.day} {label}</p>
      {payload
        .filter((item) => item.name !== t.baseline)
        .map((item) => (
          <p key={item.name} className="flex gap-3 py-0.5">
            <span style={{ color: item.color }}>{item.name}</span>
            <span className="text-white">{item.name === t.accuracy ? `${item.value}%` : `${item.value} WPM`}</span>
          </p>
        ))}
    </div>
  );
}

export default App;
