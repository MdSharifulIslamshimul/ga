import { Account, LossBuffer } from "../types/account";
import { consumedFraction } from "../lib/accountHealth";
import { HEALTH_THRESHOLDS } from "../constants";
import { formatCurrency } from "../lib/format";

function colorFor(consumedPct: number): string {
  if (consumedPct >= HEALTH_THRESHOLDS.danger) return "var(--color-negative)";
  if (consumedPct >= HEALTH_THRESHOLDS.caution) return "var(--color-caution)";
  return "var(--color-positive)";
}

function Row({
  label,
  buffer,
  breached,
}: {
  label: string;
  buffer: LossBuffer;
  breached: boolean;
}) {
  const consumedPct = breached ? 100 : consumedFraction(buffer) * 100;
  const color = colorFor(consumedPct);
  const dead = breached || buffer.remaining <= 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
          {label}
        </span>
        <span style={{ fontSize: "15px", fontWeight: 700, color }}>
          {dead ? "Breached" : formatCurrency(buffer.remaining, 0)}
        </span>
      </div>
      <div
        role="meter"
        aria-label={`${label}: ${Math.round(consumedPct)} percent used`}
        aria-valuenow={Math.round(consumedPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          height: 6,
          borderRadius: 3,
          background: "var(--track)",
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

export function DrawdownSafety({ account }: { account: Account }) {
  const breached = account.status === "breached";
  const rows: { label: string; buffer: LossBuffer }[] = [];
  if (account.dailyLossLimit)
    rows.push({ label: "Daily loss left", buffer: account.dailyLossLimit });
  if (account.maxLossLimit)
    rows.push({ label: "Max loss left", buffer: account.maxLossLimit });

  if (rows.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "14px 16px",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      {rows.map((r) => (
        <Row key={r.label} label={r.label} buffer={r.buffer} breached={breached} />
      ))}
    </div>
  );
}
