import { BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Page } from "../components/Nav";

export function Help({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { t } = useApp();

  return (
    <div className="mx-auto max-w-[860px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24 kf-page-in">
      {/* Heading */}
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

      {/* Bullets */}
      <section className="rounded-lg border border-[var(--kf-hairline)] bg-[var(--kf-canvas)]">
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

      {/* Footer CTA → Settings */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button
          onClick={() => onNavigate("dashboard")}
          className="text-sm text-[var(--kf-muted)] underline decoration-dotted underline-offset-4 transition-colors duration-150 hover:text-[var(--kf-ink)]"
        >
          ← {t.navDashboard}
        </button>
      </div>
    </div>
  );
}
