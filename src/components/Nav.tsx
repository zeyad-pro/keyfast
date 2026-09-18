import { BookOpen, Languages, LayoutDashboard, PlusCircle, Settings } from "lucide-react";
import { BrandMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useApp } from "../context/AppContext";

export type Page = "dashboard" | "new" | "help" | "settings";

export function Nav({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const { t, lang, setLang } = useApp();

  const items: Array<{ id: Page; label: string; icon: React.ReactNode }> = [
    { id: "dashboard", label: t.navDashboard, icon: <LayoutDashboard size={15} /> },
    { id: "new",       label: t.navNew,       icon: <PlusCircle size={15} /> },
    { id: "help",      label: t.navHelp,      icon: <BookOpen size={15} /> },
    { id: "settings",  label: t.settings,     icon: <Settings size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--kf-hairline)] bg-[var(--kf-canvas)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex shrink-0 items-center"
          aria-label="KeyFast home"
        >
          <BrandMark />
        </button>

        <nav className="hidden items-center gap-1 sm:flex">
          {items.map((it) => {
            const active = page === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onNavigate(it.id)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "bg-[var(--kf-surface-card)] text-[var(--kf-ink)]"
                    : "text-[var(--kf-muted)] hover:text-[var(--kf-ink)]"
                }`}
              >
                {it.icon}
                {it.label}
              </button>
            );
          })}
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--kf-hairline)] px-3 text-sm text-[var(--kf-body)] transition-colors duration-150 hover:border-[var(--kf-ink)]/30"
          >
            <Languages size={14} />
            <span className="hidden sm:inline">
              {lang === "en" ? "العربية" : "English"}
            </span>
          </button>
        </div>
      </div>

      {/* mobile sub-nav */}
      <nav className="flex gap-1 overflow-x-auto border-t border-[var(--kf-hairline-soft)] px-3 py-2 sm:hidden">
        {items.map((it) => {
          const active = page === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onNavigate(it.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                active
                  ? "bg-[var(--kf-surface-card)] text-[var(--kf-ink)]"
                  : "text-[var(--kf-muted)]"
              }`}
            >
              {it.icon}
              {it.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}