import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { AppProvider, useApp } from "./context/AppContext";
import { Nav, type Page } from "./components/Nav";
import { Dashboard } from "./pages/Dashboard";
import { NewDay } from "./pages/NewDay";
import { Help } from "./pages/Help";
import { Settings } from "./pages/Settings";
import { SpikeMark } from "./components/Logo";
import { Toaster } from "./components/Toaster";
import { Portal } from "./components/Portal";

const PAGES: Page[] = ["dashboard", "new", "help", "settings"];

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
    <div className="flex min-h-screen flex-col bg-(--kf-canvas)">
      <Nav page={page} onNavigate={navigate} />

      <main key={flashKey} className="flex-1 kf-theme-fade">
        {page === "dashboard" && <Dashboard onNavigate={navigate} />}
        {page === "new" && <NewDay onNavigate={navigate} />}
        {page === "help" && <Help onNavigate={navigate} />}
        {page === "settings" && <Settings />}
      </main>

      <footer className="border-t border-(--kf-hairline) bg-(--kf-canvas)">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-(--kf-muted)">
            <SpikeMark size={14} color="var(--kf-muted)" />
            <span>KeyFast · {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://github.com/zeyad-pro/keyfast"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-(--kf-hairline) px-4 py-2 text-xs text-(--kf-body) transition-colors duration-150 hover:border-(--kf-ink)/30"
            >
              <Github size={13} />
              {t.githubSource}
            </a>

            <a
              href="http://prex-sand.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-md border border-(--kf-hairline) px-4 py-2 text-xs text-(--kf-body) transition-colors duration-150 hover:border-(--kf-ink)/30"
            >
              <span className="text-(--kf-muted)">Made by</span>
              <span className="font-display text-sm tracking-tight text-(--kf-primary)">
                PREX
              </span>
              <span className="text-(--kf-muted) transition-colors duration-150 group-hover:text-(--kf-ink)">
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
