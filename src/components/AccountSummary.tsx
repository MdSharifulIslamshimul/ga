import { Account } from "../types/account";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatProfit(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatCurrency(value)}`;
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

interface AccountSummaryProps {
  account: Account;
}

export function AccountSummary({ account }: AccountSummaryProps) {
  const isPositive = account.profit >= 0;
  const profitColor = isPositive
    ? "var(--color-positive)"
    : "var(--color-negative)";
  const profitBg = isPositive
    ? "var(--color-positive-bg)"
    : "var(--color-negative-bg)";

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--color-text-secondary)",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Balance
      </div>
      <div
        style={{
          fontSize: "32px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "var(--color-text-primary)",
        }}
      >
        {formatCurrency(account.balance)}
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          marginTop: 8,
          padding: "4px 10px",
          borderRadius: 20,
          fontSize: "13px",
          fontWeight: 600,
          color: profitColor,
          background: profitBg,
        }}
      >
        {formatProfit(account.profit)} ({formatPercent(account.profitPercentage)}
        )
      </div>
    </div>
  );
}
