interface MetricCardProps {
  label: string;
  value: string;
  valueColor?: string;
  caption?: string;
}

export function MetricCard({ label, value, valueColor, caption }: MetricCardProps) {
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
          fontSize: "11px",
          fontWeight: 500,
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: valueColor ?? "var(--color-text-primary)",
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
      {caption && (
        <div
          style={{ fontSize: "10px", color: "var(--color-text-muted)", marginTop: 2 }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
