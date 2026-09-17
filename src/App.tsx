import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Nav, type Page } from "./components/Nav";
import { Dashboard } from "./pages/Dashboard";
import { NewDay } from "./pages/NewDay";
import { Help } from "./pages/Help";
import { SpikeMark } from "./components/Logo";

const PAGES: Page[] = ["dashboard", "new", "help"];

function readHash(): Page {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return (PAGES.includes(raw as Page) ? raw : "dashboard") as Page;
}

function Shell() {
  const { theme } = useApp();
  const [page, setPage] = useState<Page>(readHash);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    const onHash = () => setPage(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // retrigger subtle fade each time the theme changes
  useEffect(() => {
    setFlashKey((k) => k + 1);
  }, [theme]);

  const navigate = (p: Page) => {
    if (window.location.hash !== `#/${p}`) window.location.hash = `/${p}`;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--kf-canvas)">
      <Nav page={page} onNavigate={navigate} />

      <main key={flashKey} className="flex-1 kf-theme-fade">
        {page === "dashboard" && <Dashboard onNavigate={navigate} />}
        {page === "new" && <NewDay onNavigate={navigate} />}
        {page === "help" && <Help />}
      </main>

      <footer className="border-t border-(--kf-hairline) bg-[var(--kf-canvas)]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-[var(--kf-muted)]">
            <SpikeMark size={14} color="var(--kf-muted)" />
            <span>KeyFast · {new Date().getFullYear()}</span>
            <span className="text-[var(--kf-muted-soft)]">·</span>
            <span>{""}</span>
          </div>

          <a
            href="http://prex-sand.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-md border border-[var(--kf-hairline)] px-4 py-2 text-xs text-[var(--kf-body)] transition-colors duration-150 hover:border-[var(--kf-ink)]/30"
          >
            <span className="text-[var(--kf-muted)]">Made by</span>
            <span className="font-display text-sm tracking-tight text-[var(--kf-primary)]">
              PREX
            </span>
            <span className="text-[var(--kf-muted)] transition-colors duration-150 group-hover:text-[var(--kf-ink)]">↗</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}