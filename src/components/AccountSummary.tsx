import { Account } from "../types/account";
import { formatCurrency, formatSigned, formatPercent } from "../lib/format";

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: "10px",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: color ?? "var(--color-text-primary)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function AccountSummary({ account }: { account: Account }) {
  const isPositive = account.profitLoss >= 0;
  const profitColor = isPositive
    ? "var(--color-positive)"
    : "var(--color-negative)";
  const profitBg = isPositive
    ? "var(--color-positive-bg)"
    : "var(--color-negative-bg)";
  const profitPct = (account.profitLoss / account.initialBalance) * 100;
  const floatingColor =
    account.floatingPnl > 0
      ? "var(--color-positive)"
      : account.floatingPnl < 0
        ? "var(--color-negative)"
        : "var(--color-text-primary)";

  return (
    <div style={{ padding: "4px 16px 0" }}>
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
        Balance
      </div>
      <div
        style={{
          fontSize: "30px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {formatCurrency(account.balance)}
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          marginTop: 8,
          padding: "3px 10px",
          borderRadius: 20,
          fontSize: "12px",
          fontWeight: 600,
          color: profitColor,
          background: profitBg,
        }}
      >
        {formatSigned(account.profitLoss)} ({formatPercent(profitPct)})
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <MiniStat label="Equity" value={formatCurrency(account.equity)} />
        <MiniStat
          label="Floating P/L"
          value={formatSigned(account.floatingPnl)}
          color={floatingColor}
        />
        <MiniStat
          label="Initial"
          value={formatCurrency(account.initialBalance, 0)}
        />
      </div>
    </div>
  );
}
