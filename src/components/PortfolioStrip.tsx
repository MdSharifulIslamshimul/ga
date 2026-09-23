import { useState } from "react";
import { Account } from "../types/account";
import {
  getHealth,
  getPortfolioSummary,
  HealthLevel,
} from "../lib/accountHealth";
import { formatCurrency, formatSigned, formatSize } from "../lib/format";

const healthColor: Record<HealthLevel, string> = {
  safe: "var(--color-positive)",
  caution: "var(--color-caution)",
  danger: "var(--color-negative)",
  breached: "var(--color-negative)",
};

const healthRank: Record<HealthLevel, number> = {
  breached: 0,
  danger: 1,
  caution: 2,
  safe: 3,
};

function Chip({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
        }}
      />
      <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
        <strong style={{ color: "var(--color-text-primary)" }}>{value}</strong>{" "}
        {label}
      </span>
    </span>
  );
}

interface PortfolioStripProps {
  accounts: Account[];
  currentId: string;
  onSelect: (account: Account) => void;
}

export function PortfolioStrip({
  accounts,
  currentId,
  onSelect,
}: PortfolioStripProps) {
  const [open, setOpen] = useState(false);
  const summary = getPortfolioSummary(accounts);

  const sorted = [...accounts].sort(
    (a, b) => healthRank[getHealth(a).level] - healthRank[getHealth(b).level]
  );

  return (
    <div style={{ padding: "0 16px 4px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Portfolio summary. Expand to view all accounts."
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          width: "100%",
          padding: "9px 12px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Chip
            value={summary.total}
            label="accounts"
            color="var(--color-accent)"
          />
          {summary.nearBreach > 0 && (
            <Chip
              value={summary.nearBreach}
              label="near breach"
              color="var(--color-caution)"
            />
          )}
          {summary.breached > 0 && (
            <Chip
              value={summary.breached}
              label="breached"
              color="var(--color-negative)"
            />
          )}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
            flexShrink: 0,
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="var(--color-text-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            marginTop: 6,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            animation: "fadeIn 0.12s ease-out",
          }}
        >
          {sorted.map((account) => {
            const selected = account.id === currentId;
            const positive = account.profitLoss >= 0;
            return (
              <button
                key={account.id}
                onClick={() => {
                  onSelect(account);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "9px 12px",
                  textAlign: "left",
                  borderTop: "1px solid var(--color-border)",
                  background: selected
                    ? "var(--color-accent-soft)"
                    : "transparent",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: healthColor[getHealth(account).level],
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: selected ? 600 : 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {account.planName} · {formatSize(account.size)}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {formatCurrency(account.balance, 0)}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: positive
                      ? "var(--color-positive)"
                      : "var(--color-negative)",
                    flexShrink: 0,
                  }}
                >
                  {formatSigned(account.profitLoss, 0)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
