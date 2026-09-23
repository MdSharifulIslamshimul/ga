interface ProgressBarProps {
  label: string;
  /** 0-100 */
  percent: number;
  /** Right-aligned caption, e.g. "$3,420 / $8,000" or "3 / 5 days". */
  caption: string;
  color?: string;
}

export function ProgressBar({
  label,
  percent,
  caption,
  color = "var(--color-accent)",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--color-text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          {caption}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          height: 6,
          borderRadius: 3,
          background: "var(--color-surface-2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
