import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export function Toaster() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="fixed flex flex-col items-center gap-2 px-4 bottom-6 inset-x-0 pointer-events-none z-90">
      {toasts.map((tt) => {
        const tone =
          tt.type === "success"
            ? {
                icon: <CheckCircle2 size={15} />,
                color: "text-(--kf-success)",
              }
            : tt.type === "error"
              ? {
                  icon: <AlertCircle size={15} />,
                  color: "text-(--kf-error)",
                }
              : { icon: <Info size={15} />, color: "text-(--kf-primary)" };

        return (
          <div
            key={tt.id}
            role="status"
            className="flex items-start max-w-md gap-3 px-4 py-3 text-(--kf-ink) text-sm bg-(--kf-surface-card) border border-(--kf-hairline) rounded-md kf-fade-up pointer-events-auto"
          >
            <span className={`mt-0.5 ${tone.color}`}>{tone.icon}</span>
            <span className="leading-snug">{tt.message}</span>
            <button
              onClick={() => dismissToast(tt.id)}
              className="p-1 text-(--kf-muted) hover:text-(--kf-ink) rounded-md hover:bg-(--kf-canvas) duration-150 transition-colors -me-1 ms-2"
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
