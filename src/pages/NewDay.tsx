import { useEffect, useState } from "react";
import {
  CalendarCheck2,
  Check,
  Gauge,
  Percent,
  Power,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { dayDiff, toLocalDateString } from "../lib/tracker";
import { Confetti } from "../components/Confetti";
import { DateInput } from "../components/DateInput";
import type { Page } from "../components/Nav";

export function NewDay({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { entries, settings, t, addEntry, updateEntry, toast } = useApp();
  const { startDate } = settings;

  const today = toLocalDateString();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(today);
  const [wpm, setWpm] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [fireKey, setFireKey] = useState(0);

  // edit prefill
  useEffect(() => {
    const id = sessionStorage.getItem("keyfast.edit");
    if (!id) return;
    sessionStorage.removeItem("keyfast.edit");
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    setEditingId(id);
    setDate(entry.date);
    setWpm(String(entry.wpm));
    setAccuracy(String(entry.accuracy));
  }, [entries]);

  const dayNumber = (() => {
    if (!date) return "—";
    const d = dayDiff(startDate, date) + 1;
    return d >= 1 ? d : "—";
  })();

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!date) {
      toast.error(t.invalidDateFormat);
      return;
    }
if (!date) return toast.error(t.invalidDateFormat);
  if (date > today) return toast.error(t.futureDate); 
    const w = Number(wpm);
    const a = Number(accuracy);

    if (!Number.isFinite(w) || w < 1 || w > 400) {
      toast.error(t.invalidWpm);
      return;
    }
    if (!Number.isFinite(a) || a < 0 || a > 100) {
      toast.error(t.invalidAccuracy);
      return;
    }

    const dup = entries.find((e) => e.date === date && e.id !== editingId);
    if (dup) {
      toast.error(t.duplicate);
      return;
    }

    if (editingId) {
      updateEntry(editingId, { date, wpm: w, accuracy: a });
      toast.success(t.updated);
    } else {
      addEntry({ date, wpm: w, accuracy: a });
      toast.success(t.saved);
      setFireKey((k) => k + 1);
    }

    setEditingId(null);
    setDate(today);
    setWpm("");
    setAccuracy("");
  };

  const cancel = () => {
    setEditingId(null);
    setDate(today);
    setWpm("");
    setAccuracy("");
  };

  return (
    <>
      <Confetti fireKey={fireKey} />

      <div className="mx-auto max-w-215 px-4 py-16 sm:px-6 lg:px-8 lg:py-24 kf-page-in">
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-(--kf-muted)">
            <Sparkles size={12} />
            {editingId ? t.editSession : t.newSessionTitle}
          </div>
          <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-(--kf-ink) sm:text-5xl">
            {editingId ? t.editSession : t.newSessionTitle}
          </h1>
          <p className="mt-4 max-w-lg text-base text-(--kf-body)">
            {t.newSessionSubtitle}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-lg border border-(--kf-hairline) bg-(--kf-canvas) p-6 sm:p-8 kf-fade-up"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t.date}>
              <DateInput
                value={date}
                onChange={setDate}
                max={today}
                invalidMessage={t.invalidDateFormat}
                maxMessage={t.futureDate}
              />
              <p className="mt-1.5 text-[11px] text-(--kf-muted)">
                {t.dateFormat}
              </p>
            </Field>

            <Field label={t.day}>
              <div className="flex h-11 items-center justify-between rounded-md border border-(--kf-hairline) bg-(--kf-surface-soft) px-3">
                <span className="text-sm font-medium text-(--kf-ink)">
                  {dayNumber}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-(--kf-muted)">
                  {settings.goalDays
                    ? `/ ${settings.goalDays}`
                    : `· ${t.unlimited}`}
                </span>
              </div>
            </Field>

            <Field label={t.speedLabel}>
              <div className="relative">
                <Gauge
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--kf-muted)"
                />
                <input
                  type="number"
                  step="any"
                  min="1"
                  max="400"
                  inputMode="decimal"
                  placeholder={t.speedPlaceholder}
                  value={wpm}
                  onChange={(e) => setWpm(e.target.value)}
                  className="h-11 w-full rounded-md border border-(--kf-hairline) bg-(--kf-canvas) pl-9 pr-3 text-sm text-(--kf-ink) outline-none transition-colors duration-150 placeholder:text-(--kf-muted-soft) focus:border-(--kf-primary)"
                />
              </div>
            </Field>

            <Field label={t.accuracyLabel}>
              <div className="relative">
                <Percent
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--kf-muted)"
                />
                <input
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  inputMode="decimal"
                  placeholder={t.accuracyPlaceholder}
                  value={accuracy}
                  onChange={(e) => setAccuracy(e.target.value)}
                  className="h-11 w-full rounded-md border border-(--kf-hairline) bg-(--kf-canvas) pl-9 pr-3 text-sm text-(--kf-ink) outline-none transition-colors duration-150 placeholder:text-(--kf-muted-soft) focus:border-(--kf-primary)"
                />
              </div>
            </Field>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-(--kf-primary) px-5 text-sm font-medium text-(--kf-on-primary) transition-colors duration-150 hover:bg-(--kf-primary-active)"
            >
              {editingId ? <Check size={15} /> : <CalendarCheck2 size={15} />}
              {editingId ? t.save : t.add}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancel}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-(--kf-hairline) px-5 text-sm text-(--kf-body) transition-colors duration-150 hover:border-(--kf-ink)/25"
              >
                <X size={15} /> {t.cancel}
              </button>
            )}
          </div>

          <p className="mt-6 border-t border-(--kf-hairline-soft) pt-5 text-xs leading-relaxed text-(--kf-muted)">
            {t.helpBullet3}
          </p>
        </form>

        <div className="mt-10">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-sm text-(--kf-muted) underline decoration-dotted underline-offset-4 transition-colors duration-150 hover:text-(--kf-ink)"
          >
            ← {t.navDashboard}
          </button>
        </div>
      </div>
    </>
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
