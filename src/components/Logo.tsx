export function SpikeMark({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path
        d="M10 1.5 L10 18.5 M1.5 10 L18.5 10 M4.2 4.2 L15.8 15.8 M15.8 4.2 L4.2 15.8"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="10" cy="10" r="2.2" fill={color} />
    </svg>
  );
}

export function Wordmark({ size = "base" }: { size?: "sm" | "base" | "lg" }) {
  const cls =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";
  return (
    <span className={`inline-flex items-baseline gap-0.5 font-display tracking-tight ${cls}`}>
      <span className="text-[var(--kf-ink)]">Key</span>
      <span className="text-[var(--kf-primary)]">Fast</span>
    </span>
  );
}

export function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2">
      <SpikeMark size={16} color="var(--kf-ink)" />
      <Wordmark />
    </span>
  );
}