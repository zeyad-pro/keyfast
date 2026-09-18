import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export function Toaster() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="fixed flex flex-col items-center gap-2 px-4 bottom-6 inset-x-0 pointer-events-none z-[90]">
      {toasts.map((tt) => {
        const tone =
          tt.type === "success"
            ? {
                icon: <CheckCircle2 size={15} />,
                color: "text-[var(--kf-success)]",
              }
            : tt.type === "error"
              ? {
                  icon: <AlertCircle size={15} />,
                  color: "text-[var(--kf-error)]",
                }
              : { icon: <Info size={15} />, color: "text-[var(--kf-primary)]" };

        return (
          <div
            key={tt.id}
            role="status"
            className="flex items-start max-w-md gap-3 px-4 py-3 text-[var(--kf-ink)] text-sm bg-[var(--kf-surface-card)] border border-[var(--kf-hairline)] rounded-md kf-fade-up pointer-events-auto"
          >
            <span className={`mt-0.5 ${tone.color}`}>{tone.icon}</span>
            <span className="leading-snug">{tt.message}</span>
            <button
              onClick={() => dismissToast(tt.id)}
              className="p-1 text-[var(--kf-muted)] hover:text-[var(--kf-ink)] rounded-md hover:bg-[var(--kf-canvas)] duration-150 transition-colors -me-1 ms-2"
              aria-label="Dismiss"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
