import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

type Piece = {
  id: string;
  left: number;
  delay: number;
  duration: number;
  color: string;
  width: number;
  height: number;
  drift: number;
  spin: number;
  round: boolean;
};

// restrained palette — no rainbow. Brand blue + warm neutrals + one amber accent
const COLORS_BY_THEME = {
  dark:  ["#6b9bff", "#6ec5bb", "#d8a35a", "#eef2f8", "#1a1f2a"],
  light: ["#3b6dd1", "#4a9d94", "#b8863b", "#14161a", "#efece2"],
};

// inside the component

export function Confetti({ fireKey }: { fireKey: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
    const { theme } = useApp();
    const COLORS = COLORS_BY_THEME[theme];
  useEffect(() => {
    if (!fireKey) return;
    const next: Piece[] = Array.from({ length: 70 }, (_, i) => ({
      id: `${fireKey}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 2.0 + Math.random() * 1.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      width: 5 + Math.random() * 6,
      height: 7 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 260,
      spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720),
      round: Math.random() > 0.75,
    }));
    setPieces(next);
    const timer = window.setTimeout(() => setPieces([]), 4000);
    return () => window.clearTimeout(timer);
  }, [fireKey]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="kf-confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            borderRadius: p.round ? "999px" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as string]: `${p.drift}px`,
            ["--spin" as string]: `${p.spin}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}