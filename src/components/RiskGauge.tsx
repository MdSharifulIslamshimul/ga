import { LossBuffer } from "../types/account";
import { consumedFraction } from "../lib/accountHealth";
import { HEALTH_THRESHOLDS } from "../constants";
import { formatCurrency } from "../lib/format";

interface RiskGaugeProps {
  label: string;
  buffer: LossBuffer;
}

function colorFor(consumedPct: number): string {
  if (consumedPct >= HEALTH_THRESHOLDS.danger) return "var(--color-negative)";
  if (consumedPct >= HEALTH_THRESHOLDS.caution) return "var(--color-caution)";
  return "var(--color-positive)";
}

export function RiskGauge({ label, buffer }: RiskGaugeProps) {
  const consumedPct = consumedFraction(buffer) * 100;
  const color = colorFor(consumedPct);
  const breached = buffer.remaining <= 0;

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
        {buffer.percentTarget !== undefined && (
          <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
            {buffer.percentTarget}%
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: "17px", fontWeight: 700, color }}>
          {breached ? "Breached" : formatCurrency(buffer.remaining, 0)}
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          {Math.round(consumedPct)}% used
        </span>
      </div>

      <div
        role="meter"
        aria-label={`${label}: ${Math.round(consumedPct)} percent of buffer used`}
        aria-valuenow={Math.round(consumedPct)}
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
            width: `${Math.max(2, consumedPct)}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.4s ease, background 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
