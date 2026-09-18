import {
  BookOpen,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

export function Help() {
  const { t, settings, updateSettings, reset, toasts } = useApp();

  const [startDate, setStartDate] = useState(settings.startDate);
  const [goalDays, setGoalDays] = useState(String(settings.goalDays));
  const [baselineWpm, setBaselineWpm] = useState(String(settings.baselineWpm));
  const [baselineAcc, setBaselineAcc] = useState(
    String(settings.baselineAccuracy),
  );
  // const [notice, toast.success] = useState("");

  useEffect(() => {
    setStartDate(settings.startDate);
    setGoalDays(String(settings.goalDays));
    setBaselineWpm(String(settings.baselineWpm));
    setBaselineAcc(String(settings.baselineAccuracy));
  }, [settings]);

  // useEffect(() => {
  //   if (!notice) return;
  //   const timer = window.setTimeout(() => toast.success(""), 2400);
  //   return () => window.clearTimeout(timer);
  // }, [notice]);
  const { toast } = useApp();
  const save = () => {
    updateSettings({
      startDate,
      goalDays: Math.max(0, Number(goalDays) || 0),
      baselineWpm: Number(baselineWpm) || 30,
      baselineAccuracy: Number(baselineAcc) || 95,
    });
    toast.success(t.settingsSaved);
  };

  const onReset = () => {
    if (window.confirm(t.resetConfirm)) {
      reset();
      toast.success(t.resetDone);
    }
  };

  return (
    <div className="mx-auto max-w-[860px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24 kf-page-in">
      <div className="mb-12">
        <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--kf-muted)]">
          <BookOpen size={12} /> {t.navHelp}
        </div>
        <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-[var(--kf-ink)] sm:text-5xl">
          {t.helpTitle}
        </h1>
        <p className="mt-4 max-w-lg text-base text-[var(--kf-body)]">
          {t.helpIntro}
        </p>
      </div>

      <section className="mb-10 rounded-lg border border-[var(--kf-hairline)] bg-[var(--kf-canvas)]">
        <ul className="divide-y divide-[var(--kf-hairline-soft)]">
          {[t.helpBullet1, t.helpBullet2, t.helpBullet3, t.helpBullet4].map(
            (line, i) => (
              <li key={i} className="flex gap-4 p-6">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--kf-surface-card)] text-xs font-medium text-[var(--kf-ink)]">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-[var(--kf-body)]">
                  {line}
                </p>
              </li>
            ),
          )}
        </ul>
      </section>

      <section className="rounded-lg border border-[var(--kf-hairline)] bg-[var(--kf-canvas)] p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <SettingsIcon size={15} className="text-[var(--kf-primary)]" />
          <h2 className="font-display text-2xl tracking-tight text-[var(--kf-ink)]">
            {t.settings}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label={t.settingsStart}>
            <input
              type="date"
              lang="en-GB"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-11 w-full rounded-md border border-[var(--kf-hairline)] bg-[var(--kf-canvas)] px-3 text-sm text-[var(--kf-ink)] outline-none transition-colors duration-150 focus:border-[var(--kf-primary)]"
            />
          </Field>
          <Field label={t.settingsGoal}>
            <input
              type="number"
              step="1"
              min="0"
              value={goalDays}
              onChange={(e) => setGoalDays(e.target.value)}
              className="h-11 w-full rounded-md border border-[var(--kf-hairline)] bg-[var(--kf-canvas)] px-3 text-sm text-[var(--kf-ink)] outline-none transition-colors duration-150 focus:border-[var(--kf-primary)]"
            />
          </Field>
          <Field label={t.settingsBaselineWpm}>
            <input
              type="number"
              step="any"
              value={baselineWpm}
              onChange={(e) => setBaselineWpm(e.target.value)}
              className="h-11 w-full rounded-md border border-[var(--kf-hairline)] bg-[var(--kf-canvas)] px-3 text-sm text-[var(--kf-ink)] outline-none transition-colors duration-150 focus:border-[var(--kf-primary)]"
            />
          </Field>
          <Field label={t.settingsBaselineAcc}>
            <input
              type="number"
              step="any"
              value={baselineAcc}
              onChange={(e) => setBaselineAcc(e.target.value)}
              className="h-11 w-full rounded-md border border-[var(--kf-hairline)] bg-[var(--kf-canvas)] px-3 text-sm text-[var(--kf-ink)] outline-none transition-colors duration-150 focus:border-[var(--kf-primary)]"
            />
          </Field>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={save}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--kf-primary)] px-5 text-sm font-medium text-[var(--kf-on-primary)] transition-colors duration-150 hover:bg-[var(--kf-primary-active)]"
          >
            <Save size={15} /> {t.save}
          </button>
          <button
            onClick={onReset}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[var(--kf-hairline)] px-5 text-sm text-[var(--kf-body)] transition-colors duration-150 hover:border-[var(--kf-error)]/50 hover:text-[var(--kf-error)]"
          >
            <RotateCcw size={15} /> {t.reset}
          </button>
        </div>
      </section>

      {/* {notice && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 kf-fade-up rounded-md border border-[var(--kf-hairline)] bg-[var(--kf-canvas)] px-5 py-3 text-sm text-[var(--kf-ink)]">
          {notice}
        </div>
      )} */}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--kf-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}
