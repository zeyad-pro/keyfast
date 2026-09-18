import { useEffect, useState } from "react";
import { RotateCcw, Save, Settings as SettingsIcon } from "lucide-react";
import { useApp } from "../context/AppContext";
import { toLocalDateString } from "../lib/tracker";
import { DateInput } from "../components/DateInput";

export function Settings() {
  const { t, settings, updateSettings, reset, toast } = useApp();

  const [startDate, setStartDate] = useState(settings.startDate);
  const [goalDays, setGoalDays] = useState(String(settings.goalDays));
  const [baselineWpm, setBaselineWpm] = useState(String(settings.baselineWpm));
  const [baselineAcc, setBaselineAcc] = useState(
    String(settings.baselineAccuracy),
  );

  useEffect(() => {
    setStartDate(settings.startDate);
    setGoalDays(String(settings.goalDays));
    setBaselineWpm(String(settings.baselineWpm));
    setBaselineAcc(String(settings.baselineAccuracy));
  }, [settings]);
  const today = toLocalDateString();

  const save = () => {
    if (startDate > today) {
      toast.error(t.futureDate);
      return;
    }
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
      {/* Heading */}
      <div className="mb-12">
        <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-(--kf-muted)">
          <SettingsIcon size={12} /> {t.settings}
        </div>
        <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-(--kf-ink) sm:text-5xl">
          {t.settings}
        </h1>
      </div>

      {/* Form card */}
      <section className="rounded-lg border border-(--kf-hairline) bg-(--kf-canvas) p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label={t.settingsStart}>
            <DateInput
              value={startDate}
              onChange={setStartDate}
              max={today}
              invalidMessage={t.invalidDateFormat}
              maxMessage={t.futureDate}
            />
          </Field>

          <Field label={t.settingsGoal}>
            <input
              type="number"
              step="1"
              min="0"
              value={goalDays}
              onChange={(e) => setGoalDays(e.target.value)}
              className="h-11 w-full rounded-md border border-(--kf-hairline) bg-(--kf-canvas) px-3 text-sm text-(--kf-ink) outline-none transition-colors duration-150 focus:border-(--kf-primary)"
            />
          </Field>

          <Field label={t.settingsBaselineWpm}>
            <input
              type="number"
              step="any"
              value={baselineWpm}
              onChange={(e) => setBaselineWpm(e.target.value)}
              className="h-11 w-full rounded-md border border-(--kf-hairline) bg-(--kf-canvas) px-3 text-sm text-(--kf-ink) outline-none transition-colors duration-150 focus:border-(--kf-primary)"
            />
          </Field>

          <Field label={t.settingsBaselineAcc}>
            <input
              type="number"
              step="any"
              value={baselineAcc}
              onChange={(e) => setBaselineAcc(e.target.value)}
              className="h-11 w-full rounded-md border border-(--kf-hairline) bg-(--kf-canvas) px-3 text-sm text-(--kf-ink) outline-none transition-colors duration-150 focus:border-(--kf-primary)"
            />
          </Field>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-(--kf-hairline-soft) pt-6">
          <button
            onClick={save}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-(--kf-primary) px-5 text-sm font-medium text-(--kf-on-primary) transition-colors duration-150 hover:bg-(--kf-primary-active)"
          >
            <Save size={15} /> {t.save}
          </button>
          <button
            onClick={onReset}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-(--kf-hairline) px-5 text-sm text-(--kf-body) transition-colors duration-150 hover:border-(--kf-error)/50 hover:text-(--kf-error)"
          >
            <RotateCcw size={15} /> {t.reset}
          </button>
        </div>
      </section>
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
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-(--kf-muted)">
        {label}
      </span>
      {children}
    </label>
  );
}
