import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* =========================================================
   Chart types
   ========================================================= */
export type ChartDatum = {
  id: string;
  day: number;
  date: string;
  wpm: number;
  accuracy: number;
};

type ChartType = "speed" | "accuracy" | "both";

/* =========================================================
   ChartCard — theme-aware, flat, no shadow, no gradient
   ========================================================= */
export function ChartCard({
  data,
  type,
  baselineWpm,
  baselineAccuracy,
  title,
  wpmLabel,
  accLabel,
  baselineLabel,
  dayLabel,
}: {
  data: ChartDatum[];
  type: ChartType;
  baselineWpm: number;
  baselineAccuracy: number;
  title: string;
  wpmLabel: string;
  accLabel: string;
  baselineLabel: string;
  dayLabel: string;
}) {
  const maxDay = Math.max(30, ...data.map((d) => d.day));
  const ticks = Array.from({ length: maxDay }, (_, i) => i + 1);
  const showWpm = type === "speed" || type === "both";
  const showAcc = type === "accuracy" || type === "both";

  return (
    <div className="rounded-lg border border-[var(--kf-hairline)] bg-[var(--kf-canvas)] p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl tracking-tight text-[var(--kf-ink)]">
          {title}
        </h3>
        <div className="flex gap-4 text-xs text-[var(--kf-muted)]">
          {showWpm && (
            <span className="inline-flex items-center gap-2">
              <i className="h-0.5 w-5 bg-[var(--kf-primary)]" />
              {wpmLabel}
            </span>
          )}
          {showAcc && (
            <span className="inline-flex items-center gap-2">
              <i className="h-0.5 w-5 bg-[var(--kf-accent-teal)]" />
              {accLabel}
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid
              stroke="var(--kf-hairline)"
              strokeDasharray="2 4"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              type="number"
              domain={[1, maxDay]}
              ticks={ticks}
              tick={{ fill: "var(--kf-muted)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--kf-hairline)" }}
              interval={Math.max(0, Math.floor(maxDay / 12) - 1)}
            />

            {showWpm && (
              <YAxis
                yAxisId="wpm"
                domain={[0, "auto"]}
                tick={{ fill: "var(--kf-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={38}
              />
            )}

            {showAcc && (
              <YAxis
                yAxisId="acc"
                orientation={type === "both" ? "right" : "left"}
                domain={[0, 100]}
                tick={{ fill: "var(--kf-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                width={type === "both" ? 42 : 44}
              />
            )}

            <Tooltip
              content={<ChartTooltip dayLabel={dayLabel} />}
              cursor={{ stroke: "var(--kf-primary)", strokeOpacity: 0.25 }}
            />

            {showWpm && (
              <>
                <Line
                  yAxisId="wpm"
                  type="monotone"
                  dataKey="wpm"
                  name={wpmLabel}
                  stroke="var(--kf-primary)"
                  strokeWidth={1.8}
                  dot={{
                    r: 3,
                    fill: "var(--kf-primary)",
                    stroke: "var(--kf-canvas)",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 4.5 }}
                  connectNulls={false}
                  isAnimationActive={true}
                  animationDuration={400}
                />
                <Line
                  yAxisId="wpm"
                  type="monotone"
                  dataKey={() => baselineWpm}
                  stroke="var(--kf-muted-soft)"
                  strokeDasharray="3 5"
                  strokeWidth={1}
                  dot={false}
                  name={baselineLabel}
                  isAnimationActive={false}
                />
              </>
            )}

            {showAcc && (
              <>
                <Line
                  yAxisId="acc"
                  type="monotone"
                  dataKey="accuracy"
                  name={accLabel}
                  stroke="var(--kf-accent-teal)"
                  strokeWidth={1.8}
                  dot={{
                    r: 3,
                    fill: "var(--kf-accent-teal)",
                    stroke: "var(--kf-canvas)",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 4.5 }}
                  connectNulls={false}
                  isAnimationActive={true}
                  animationDuration={400}
                />
                <Line
                  yAxisId="acc"
                  type="monotone"
                  dataKey={() => baselineAccuracy}
                  stroke="var(--kf-muted-soft)"
                  strokeDasharray="3 5"
                  strokeWidth={1}
                  dot={false}
                  name={baselineLabel}
                  isAnimationActive={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* =========================================================
   ChartTooltip — theme-aware, flat, no shadow
   ========================================================= */
function ChartTooltip({
  active,
  payload,
  label,
  dayLabel,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
  dayLabel: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-[var(--kf-hairline)] bg-[var(--kf-surface-card)] px-3 py-2 text-xs">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-[var(--kf-muted)]">
        {dayLabel} {label}
      </p>
      {payload.map((item) => (
        <p key={item.name} className="flex items-center gap-3 py-0.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: item.color }}
          />
          <span className="text-[var(--kf-body)]">{item.name}</span>
          <span className="ml-auto font-medium text-[var(--kf-ink)]">
            {item.value}
            {item.name.toLowerCase().includes("accuracy") ||
            item.name.includes("دقة")
              ? "%"
              : ""}
          </span>
        </p>
      ))}
    </div>
  );
}