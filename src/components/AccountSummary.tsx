import { Account } from "../types/account";
import { formatCurrency, formatSigned, formatPercent } from "../lib/format";

export function AccountSummary({ account }: { account: Account }) {
  const isPositive = account.profitLoss >= 0;
  const profitColor = isPositive
    ? "var(--color-positive)"
    : "var(--color-negative)";
  const profitBg = isPositive
    ? "var(--color-positive-bg)"
    : "var(--color-negative-bg)";
  const profitPct = (account.profitLoss / account.initialBalance) * 100;

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
          fontSize: "34px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        {formatCurrency(account.balance)}
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          marginTop: 8,
          padding: "4px 10px",
          borderRadius: 20,
          fontSize: "12px",
          fontWeight: 600,
          color: profitColor,
          background: profitBg,
        }}
      >
        {formatSigned(account.profitLoss)} ({formatPercent(profitPct)})
      </div>
    </div>
  );
}
