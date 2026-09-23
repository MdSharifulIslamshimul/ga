import { useState } from "react";
import { Account, Verdict } from "../types/account";
import { ProgressBar } from "./ProgressBar";
import { MetricCard } from "./MetricCard";
import { RiskCardRow } from "./RiskCardRow";
import { LeaderboardRow } from "./LeaderboardRow";
import { formatCurrency, formatSigned, formatSize } from "../lib/format";

const consistencyColor: Record<Verdict | "not_applicable", string> = {
  clean: "var(--color-positive)",
  warning: "var(--color-caution)",
  violation: "var(--color-negative)",
  not_applicable: "var(--color-text-muted)",
};

const consistencyLabel: Record<Verdict | "not_applicable", string> = {
  clean: "Clean",
  warning: "Warning",
  violation: "Violation",
  not_applicable: "N/A",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function cycleText(account: Account): string {
  const start = new Date(account.cycleStart).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  if (account.cycleEnd === "unlimited") return `${start} → Unlimited`;
  const end = new Date(account.cycleEnd).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${start} → ${end}`;
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
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
      <div style={{ fontSize: "13px", fontWeight: 600, color: color ?? "var(--color-text-primary)" }}>
        {value}
      </div>
    </div>
  );
}

export function DetailsSection({ account }: { account: Account }) {
  const [open, setOpen] = useState(false);
  const floatingColor =
    account.floatingPnl > 0
      ? "var(--color-positive)"
      : account.floatingPnl < 0
        ? "var(--color-negative)"
        : "var(--color-text-primary)";

  return (
    <div style={{ padding: "0 16px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          width: "100%",
          padding: "8px",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--color-text-secondary)",
        }}
      >
        {open ? "Hide details" : "Details"}
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            paddingTop: 4,
            animation: "fadeIn 0.12s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 14px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <Stat label="Equity" value={formatCurrency(account.equity)} />
            <Stat label="Floating P/L" value={formatSigned(account.floatingPnl)} color={floatingColor} />
            <Stat label="Initial" value={formatCurrency(account.initialBalance, 0)} />
          </div>

          {account.minTradingDays && (
            <ProgressBar
              label="Min Trading Days"
              percent={(account.minTradingDays.completed / account.minTradingDays.required) * 100}
              caption={`${account.minTradingDays.completed} / ${account.minTradingDays.required} days`}
            />
          )}

          {account.maxInactiveDays && (
            <ProgressBar
              label="Max Inactive Days"
              percent={(account.maxInactiveDays.used / account.maxInactiveDays.limit) * 100}
              caption={`${account.maxInactiveDays.used} / ${account.maxInactiveDays.limit} days`}
              color="var(--color-caution)"
            />
          )}

          {(account.consistency || account.payoutEligibleDate) && (
            <div style={{ display: "flex", gap: 10 }}>
              {account.consistency && (
                <div style={{ flex: 1 }}>
                  <MetricCard
                    label="Consistency"
                    value={consistencyLabel[account.consistency.status]}
                    valueColor={consistencyColor[account.consistency.status]}
                    caption={
                      account.kind === "futures" && account.consistency.requiredProfit !== undefined
                        ? `Req ${formatSize(account.consistency.requiredProfit)}`
                        : account.consistency.percent !== undefined
                          ? `${account.consistency.percent}% of limit`
                          : undefined
                    }
                  />
                </div>
              )}
              {account.payoutEligibleDate && (
                <div style={{ flex: 1 }}>
                  <MetricCard
                    label="Payout Eligible"
                    value={formatDate(account.payoutEligibleDate)}
                    valueColor="var(--color-accent)"
                  />
                </div>
              )}
            </div>
          )}

          {account.riskCard && <RiskCardRow riskCard={account.riskCard} />}
          {account.leaderboard && <LeaderboardRow leaderboard={account.leaderboard} />}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "11px",
              color: "var(--color-text-muted)",
            }}
          >
            <span>Trading cycle</span>
            <span style={{ color: "var(--color-text-secondary)" }}>{cycleText(account)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
