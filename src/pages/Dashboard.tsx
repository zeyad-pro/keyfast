import { useEffect, useMemo, useState } from "react";
import { Portal } from "../components/Portal";
import {
  Activity,
  CalendarDays,
  Sparkles,
  Download,
  Edit3,
  Flame,
  Gauge,
  Trash2,
  Trophy,
  Zap,
  LogsIcon,
  Keyboard,
  KeyboardIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  computeStreak,
  dayDiff,
  formatDate,
  toLocalDateString,
} from "../lib/tracker";
import { ChartCard, type ChartDatum } from "../components/Charts";
import type { Page } from "../components/Nav";

export function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { entries, settings, t, lang, deleteEntry } = useApp();
  const { startDate, goalDays, baselineWpm, baselineAccuracy } = settings;

  const chartData: ChartDatum[] = useMemo(() => {
    return [...entries]
      .map((e) => ({ ...e, day: dayDiff(startDate, e.date) + 1 }))
      .filter((e) => e.day >= 1 && (goalDays === 0 || e.day <= goalDays))
      .sort((a, b) => a.day - b.day);
  }, [entries, startDate, goalDays]);

  const stats = useMemo(() => {
    const last = chartData.at(-1);
    const maxWpm = chartData.reduce((h, x) => Math.max(h, x.wpm), baselineWpm);
    const maxAcc = chartData.reduce(
      (h, x) => Math.max(h, x.accuracy),
      baselineAccuracy,
    );
    const avgAcc = chartData.length
      ? chartData.reduce((s, x) => s + x.accuracy, 0) / chartData.length
      : 0;
    return {
      current: last?.wpm ?? baselineWpm,
      maxWpm,
      maxAcc,
      avgAcc,
      completed: chartData.length,
      streak: computeStreak(chartData.map((x) => x.day)),
    };
  }, [chartData, baselineWpm, baselineAccuracy]);

  const exportFile = (type: "csv" | "json") => {
    const rows = [...chartData];
    let content = "",
      mime = "",
      ext = "";
    if (type === "json") {
      content = JSON.stringify(
        { startDate, baselineWpm, baselineAccuracy, days: rows },
        null,
        2,
      );
      mime = "application/json";
      ext = "json";
    } else {
      const header = "day,date,wpm,accuracy";
      const body = rows
        .map((r) => `${r.day},${r.date},${r.wpm},${r.accuracy}`)
        .join("\n");
      content = `${header}\n${body}`;
      mime = "text/csv;charset=utf-8";
      ext = "csv";
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keyfast-${toLocalDateString()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [welcome, setWelcome] = useState(() => {
    return entries.length === 0 && !localStorage.getItem("keyfast.onboarded");
  });

  const dismissWelcome = () => {
    localStorage.setItem("keyfast.onboarded", "1");
    setWelcome(false);
  };

  const goAdd = () => {
    dismissWelcome();
    onNavigate("new");
  };

  const isEmpty = chartData.length === 0;
  const dash = isEmpty ? "—" : null;
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20 kf-page-in">
      {welcome && (
       <Portal>
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--kf-canvas)]/85 px-4 backdrop-blur-sm kf-fade-up">
      <div className="w-full max-w-md rounded-lg border border-[var(--kf-hairline)] bg-[var(--kf-surface-card)] p-8 text-center"> 
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--kf-primary)] text-[var(--kf-on-primary)]">
              <Sparkles size={18} />
            </div>
            <h2 className="font-display text-3xl tracking-tight text-[var(--kf-ink)]">
              {t.welcomeTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--kf-body)]">
              {t.welcomeBody}
            </p>
            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={goAdd}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-[var(--kf-primary)] px-5 text-sm font-medium text-[var(--kf-on-primary)] transition-colors duration-150 hover:bg-[var(--kf-primary-active)]"
              >
                {t.welcomeAdd}
              </button>
              <button
                onClick={dismissWelcome}
                className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--kf-hairline)] px-5 text-sm text-[var(--kf-body)] transition-colors duration-150 hover:border-[var(--kf-ink)]/25"
              >
                {t.welcomeSkip}
              </button>
            </div>
          </div>
        </div>
          </Portal>

      )}

      {/* ============ Editorial intro ============ */}
      <section className="mb-16 max-w-3xl">
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--kf-muted)]">
        <Keyboard className="h-4" />
          {t.tagline}
        </div>
        <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-[var(--kf-ink)] sm:text-6xl">
          {t.current} &amp; {t.accuracy.toLowerCase()},{" "}
          <span className="text-[var(--kf-primary)]">by the day.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-[var(--kf-body)]">
          {t.subtitle}
        </p>
      </section>

      {/* ============ Stats row ============ */}
      <section className="mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--kf-hairline)] bg-[var(--kf-hairline)] sm:grid-cols-3 lg:grid-cols-6 kf-stagger">
        <Stat
          icon={<Flame size={15} />}
          label={t.streak}
          value={dash ?? `${stats.streak}`}
          unit={t.days}
        />
        <Stat
          icon={<Zap size={15} />}
          label={t.current}
          value={dash ?? `${stats.current}`}
          unit="WPM"
        />
        <Stat
          icon={<Trophy size={15} />}
          label={t.max}
          value={dash ?? `${stats.maxWpm}`}
          unit="WPM"
        />
        <Stat
          icon={<Activity size={15} />}
          label={t.maxAccuracy}
          value={dash ?? stats.maxAcc.toFixed(1)}
          unit="%"
        />
        <Stat
          icon={<Gauge size={15} />}
          label={t.avg}
          value={dash ?? stats.avgAcc.toFixed(1)}
          unit="%"
        />
        <Stat
          icon={<CalendarDays size={15} />}
          label={t.completed}
          value={dash ?? `${stats.completed}`}
          unit={goalDays ? `/ ${goalDays}` : `· ${t.unlimited}`}
        />
      </section>

      {/* ============ Charts ============ */}
      <section className="mb-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--kf-muted)]">
              Performance
            </p>
            <h2 className="font-display text-3xl tracking-tight text-[var(--kf-ink)]">
              Three views of your progress
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            data={chartData}
            type="speed"
            baselineWpm={baselineWpm}
            baselineAccuracy={baselineAccuracy}
            title={t.chartSpeed}
            wpmLabel={t.wpm}
            accLabel={t.accuracy}
            baselineLabel={t.baseline}
            dayLabel={t.day}
          />
          <ChartCard
            data={chartData}
            type="accuracy"
            baselineWpm={baselineWpm}
            baselineAccuracy={baselineAccuracy}
            title={t.chartAccuracy}
            wpmLabel={t.wpm}
            accLabel={t.accuracy}
            baselineLabel={t.baseline}
            dayLabel={t.day}
          />
          <div className="lg:col-span-2">
            <ChartCard
              data={chartData}
              type="both"
              baselineWpm={baselineWpm}
              baselineAccuracy={baselineAccuracy}
              title={t.chartBoth}
              wpmLabel={t.wpm}
              accLabel={t.accuracy}
              baselineLabel={t.baseline}
              dayLabel={t.day}
            />
          </div>
        </div>
      </section>

      {/* ============ History table ============ */}
      <section className="rounded-lg border border-[var(--kf-hairline)] bg-[var(--kf-canvas)]">
        <div className="flex flex-col gap-3 border-b border-[var(--kf-hairline)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--kf-muted)]">
              {t.history}
            </p>
            <h2 className="font-display text-2xl tracking-tight text-[var(--kf-ink)]">
              {t.recordedDays}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportFile("csv")}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--kf-hairline)] px-3 text-xs text-[var(--kf-body)] transition-colors duration-150 hover:border-[var(--kf-ink)]/25"
            >
              <Download size={13} /> {t.csv}
            </button>
            <button
              onClick={() => exportFile("json")}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--kf-hairline)] px-3 text-xs text-[var(--kf-body)] transition-colors duration-150 hover:border-[var(--kf-ink)]/25"
            >
              <Download size={13} /> {t.json}
            </button>
          </div>
        </div>
        {chartData.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center gap-3 p-10 text-center">
            <CalendarDays size={26} className="text-[var(--kf-muted)]" />
            <p className="font-display text-2xl text-[var(--kf-ink)]">
              {t.emptyTitle}
            </p>
            <p className="text-sm text-[var(--kf-muted)]">{t.emptyBody}</p>
            <button
              onClick={() => onNavigate("new")}
              className="mt-2 inline-flex h-9 items-center gap-2 rounded-md bg-[var(--kf-primary)] px-4 text-xs font-medium text-[var(--kf-on-primary)] transition-colors duration-150 hover:bg-[var(--kf-primary-active)]"
            >
              {t.welcomeAdd}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-[var(--kf-hairline)] text-[10px] uppercase tracking-[0.14em] text-[var(--kf-muted)]">
                  <th className="px-6 py-3 font-medium">{t.day}</th>
                  <th className="px-6 py-3 font-medium">{t.date}</th>
                  <th className="px-6 py-3 font-medium">{t.wpm}</th>
                  <th className="px-6 py-3 font-medium">{t.accuracy}</th>
                  <th className="px-6 py-3 text-right font-medium">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[var(--kf-hairline-soft)] text-sm last:border-0 transition-colors duration-150 hover:bg-[var(--kf-surface-soft)]"
                  >
                    <td className="px-6 py-3.5">
                      <span className="inline-flex h-6 min-w-8 items-center justify-center rounded-md bg-[var(--kf-surface-card)] px-2 text-xs font-medium text-[var(--kf-ink)]">
                        {entry.day}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-[var(--kf-body)]">
                      {formatDate(entry.date, lang)}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-[var(--kf-primary)]">
                      {entry.wpm}{" "}
                      <span className="text-[10px] text-[var(--kf-muted)]">
                        WPM
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-[var(--kf-accent-teal)]">
                      {entry.accuracy}%
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            sessionStorage.setItem("keyfast.edit", entry.id);
                            onNavigate("new");
                          }}
                          className="rounded-md p-2 text-[var(--kf-muted)] transition-colors duration-150 hover:bg-[var(--kf-surface-card)] hover:text-[var(--kf-ink)]"
                          aria-label="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="rounded-md p-2 text-[var(--kf-muted)] transition-colors duration-150 hover:bg-[var(--kf-surface-card)] hover:text-[var(--kf-error)]"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ------- Stat cell (flat, no shadow) ------- */
function Stat({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-[var(--kf-canvas)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--kf-muted)]">
          {label}
        </span>
        <span className="text-[var(--kf-muted-soft)]">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <strong className="font-display text-3xl tracking-tight text-[var(--kf-ink)]">
          {value}
        </strong>
        <span className="text-[10px] uppercase tracking-widest text-[var(--kf-muted)]">
          {unit}
        </span>
      </div>
    </div>
  );
}
