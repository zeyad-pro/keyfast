import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

const pad = (v: number) => String(v).padStart(2, "0");

/** "2025-03-15" -> "15/03/2025" */
function toDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

/** "15/3/25" -> "2025-03-15" | null */
function parseDisplay(text: string): string | null {
  const m = text.trim().match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  let y = Number(m[3]);
  if (y < 100) y += 2000;
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return `${y}-${pad(mo)}-${pad(d)}`;
}

export function DateInput({
  value, // ISO yyyy-mm-dd
  onChange,
  invalidMessage,
}: {
  value: string;
  onChange: (iso: string) => void;
  invalidMessage?: string;
}) {
  const [text, setText] = useState(() => toDisplay(value));
  const [err, setErr] = useState(false);
  const nativeRef = useRef<HTMLInputElement>(null);

  // external value sync (e.g. edit prefill)
  useEffect(() => {
    setText(toDisplay(value));
    setErr(false);
  }, [value]);

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setErr(true);
      return;
    }
    const iso = parseDisplay(trimmed);
    if (!iso) {
      setErr(true);
      return;
    }
    setErr(false);
    onChange(iso);
    setText(toDisplay(iso));
  };

  const openNative = () => {
    const el = nativeRef.current;
    if (!el) return;
    // Chrome/Edge/Firefox modern: showPicker
    if ("showPicker" in el && typeof el.showPicker === "function") {
      try { el.showPicker(); return; } catch {}
    }
    el.click();
  };

  return (
    <div className="relative">
      <input
        type="text"
        dir="ltr"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        placeholder="dd/mm/yyyy"
        value={text}
        onChange={(e) => { setText(e.target.value); if (err) setErr(false); }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(text); } }}
        className={`h-11 w-full rounded-md border bg-[var(--kf-canvas)] pl-9 pr-10 text-sm text-[var(--kf-ink)] outline-none transition-colors duration-150 placeholder:text-[var(--kf-muted-soft)] ${
          err
            ? "border-[var(--kf-error)]"
            : "border-[var(--kf-hairline)] focus:border-[var(--kf-primary)]"
        }`}
      />
      <CalendarDays
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--kf-muted)]"
      />
      <button
        type="button"
        onClick={openNative}
        aria-label="Open calendar"
        className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--kf-muted)] transition-colors duration-150 hover:bg-[var(--kf-surface-card)] hover:text-[var(--kf-ink)]"
      >
        📅
      </button>

      {/* hidden native input as a picker fallback */}
      <input
        ref={nativeRef}
        type="date"
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-y-0 right-2 w-7 opacity-0 pointer-events-none"
      />

      {err && invalidMessage && (
        <p className="mt-1.5 text-xs text-[var(--kf-error)]">{invalidMessage}</p>
      )}
    </div>
  );
}