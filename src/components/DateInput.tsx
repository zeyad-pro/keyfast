import { useEffect, useRef, useState } from "react";
import { Calendar } from "lucide-react";

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
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d)
    return null;
  return `${y}-${pad(mo)}-${pad(d)}`;
}

type ErrKind = "" | "format" | "range";

export function DateInput({
  value, // ISO yyyy-mm-dd
  onChange,
  invalidMessage,
  maxMessage,
  max, // ISO — مش مسموح بعد التاريخ ده
  min, // ISO — مش مسموح قبل التاريخ ده
}: {
  value: string;
  onChange: (iso: string) => void;
  invalidMessage?: string;
  maxMessage?: string;
  max?: string;
  min?: string;
}) {
  const [text, setText] = useState(() => toDisplay(value));
  const [err, setErr] = useState<ErrKind>("");
  const nativeRef = useRef<HTMLInputElement>(null);

  // external value sync (e.g. edit prefill)
  useEffect(() => {
    setText(toDisplay(value));
    setErr("");
  }, [value]);

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setErr("format");
      return;
    }
    const iso = parseDisplay(trimmed);
    if (!iso) {
      setErr("format");
      return;
    }
    if (max && iso > max) {
      setErr("range");
      return;
    }
    if (min && iso < min) {
      setErr("range");
      return;
    }
    setErr("");
    onChange(iso);
    setText(toDisplay(iso));
  };

  const openNative = () => {
    const el = nativeRef.current;
    if (!el) return;
    // Chrome/Edge/Firefox modern: showPicker
    if ("showPicker" in el && typeof el.showPicker === "function") {
      try {
        el.showPicker();
        return;
      } catch {}
    }
    el.click();
  };

  const errorText =
    err === "range"
      ? (maxMessage ?? invalidMessage)
      : err === "format"
        ? invalidMessage
        : "";

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
        onChange={(e) => {
          setText(e.target.value);
          if (err) setErr("");
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(text);
          }
        }}
        className={`h-11 w-full rounded-md border bg-(--kf-canvas) pl-4 pr-10 text-sm text-(--kf-ink) outline-none transition-colors duration-150 placeholder:text-(--kf-muted-soft) ${
          err
            ? "border-(--kf-error)"
            : "border-(--kf-hairline) focus:border-(--kf-primary)"
        }`}
      />

      <button
        type="button"
        onClick={openNative}
        aria-label="Open calendar"
        className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-(--kf-muted) transition-colors duration-150 hover:bg-(--kf-surface-card) hover:text-(--kf-ink)"
      >
        <Calendar className="h-4" />
      </button>

      {/* hidden native input as a picker fallback */}
      <input
        ref={nativeRef}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => e.target.value && commit(toDisplay(e.target.value))}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-y-0 right-2 w-7 opacity-0 pointer-events-none"
      />

      {errorText && (
        <p className="mt-1.5 text-xs text-(--kf-error)">{errorText}</p>
      )}
    </div>
  );
}
