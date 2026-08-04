import { getStatusCategory } from "@/lib/utils";

const SIZE = 96;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CATEGORY_COLOR: Record<string, string> = {
  cnf: "var(--color-cnf)",
  rac: "var(--color-rac)",
  wl: "var(--color-wl)",
  unknown: "var(--color-brand)",
};

export function ConfirmationGauge({
  percent,
  status,
}: {
  percent: number;
  status?: string | null;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const color = CATEGORY_COLOR[getStatusCategory(status)] ?? CATEGORY_COLOR.unknown;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="animate-fade-slide-in"
        role="img"
        aria-label={`Estimated confirmation probability: ${clamped} percent`}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          className="animate-gauge-fill"
          style={
            {
              "--gauge-circumference": CIRCUMFERENCE,
              "--gauge-offset": offset,
            } as React.CSSProperties
          }
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-display)"
          fontSize="22"
          fontWeight="700"
          fill="var(--color-ink)"
        >
          {clamped}%
        </text>
      </svg>
      <p className="text-center text-xs text-ink-muted max-w-[10rem]">
        Estimated chance of confirmation — not a guarantee
      </p>
    </div>
  );
}
