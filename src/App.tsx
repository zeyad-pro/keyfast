import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { AppProvider, useApp } from "./context/AppContext";
import { Nav, type Page } from "./components/Nav";
import { Dashboard } from "./pages/Dashboard";
import { NewDay } from "./pages/NewDay";
import { Help } from "./pages/Help";
import { SpikeMark } from "./components/Logo";
import { Toaster } from "./components/Toaster";
import { Portal } from "./components/Portal";

const PAGES: Page[] = ["dashboard", "new", "help"];

function readHash(): Page {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return (PAGES.includes(raw as Page) ? raw : "dashboard") as Page;
}

function Shell() {
  const { theme, t } = useApp();
  const [page, setPage] = useState<Page>(readHash);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    const onHash = () => setPage(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    setFlashKey((k) => k + 1);
  }, [theme]);

  const navigate = (p: Page) => {
    if (window.location.hash !== `#/${p}`) window.location.hash = `/${p}`;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--kf-canvas)]">
      <Nav page={page} onNavigate={navigate} />

      <main key={flashKey} className="flex-1 kf-theme-fade">
        {page === "dashboard" && <Dashboard onNavigate={navigate} />}
        {page === "new" && <NewDay onNavigate={navigate} />}
        {page === "help" && <Help />}
      </main>

      <footer className="bg-[var(--kf-canvas)] border-[var(--kf-hairline)] border-t">
        <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center max-w-[1200px] gap-6 mx-auto px-4 py-10 lg:px-8 sm:px-6">
          <div className="flex items-center gap-2 text-[var(--kf-muted)] text-xs">
            <SpikeMark size={14} color="var(--kf-muted)" />
            <span>KeyFast · {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://github.com/zeyad-pro/keyfast"
              target="_blank"
              rel="noreferrer"
              className="items-center gap-2 px-4 py-2 text-[var(--kf-body)] text-xs border border-[var(--kf-hairline)] rounded-md hover:border-[var(--kf-ink)]/30 duration-150 transition-colors inline-flex"
            >
              <Github size={13} />
              {t.githubSource}
            </a>

            <a
              href="http://prex-sand.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="items-center gap-2 px-4 py-2 text-[var(--kf-body)] text-xs border border-[var(--kf-hairline)] rounded-md hover:border-[var(--kf-ink)]/30 duration-150 transition-colors group inline-flex"
            >
              <span className="text-[var(--kf-muted)]">Made by</span>
              <span className="font-display text-[var(--kf-primary)] text-sm tracking-tight">
                PREX
              </span>
              <span className="text-[var(--kf-muted)] group-hover:text-[var(--kf-ink)] duration-150 transition-colors">
                ↗
              </span>
            </a>
          </div>
        </div>
      </footer>
      <Portal>
        <Toaster />
      </Portal>
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
