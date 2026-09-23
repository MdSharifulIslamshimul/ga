import { useState, useRef, useEffect } from "react";
import { Account, AccountKind, AccountStatus, Phase } from "../types/account";
import { getHealth, HealthLevel } from "../lib/accountHealth";
import { formatSize } from "../lib/format";

const phaseLabel: Record<Phase, string> = {
  challenge_p1: "Challenge P1",
  challenge_p2: "Challenge P2",
  funded: "Funded",
  competition: "Competition",
};

const kindLabel: Record<AccountKind, string> = {
  cfd: "CFD",
  futures: "Futures",
  competition: "Competitions",
};

const statusStyle: Record<AccountStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "var(--color-positive)", bg: "var(--color-positive-bg)" },
  paused: { label: "Paused", color: "var(--color-caution)", bg: "var(--color-caution-bg)" },
  breached: { label: "Breached", color: "var(--color-negative)", bg: "var(--color-negative-bg)" },
  passed: { label: "Passed", color: "var(--color-accent)", bg: "var(--color-accent-soft)" },
};

const healthColor: Record<HealthLevel, string> = {
  safe: "var(--color-positive)",
  caution: "var(--color-caution)",
  danger: "var(--color-negative)",
  breached: "var(--color-negative)",
};

const kindOrder: AccountKind[] = ["cfd", "futures", "competition"];

function StatusPill({ status }: { status: AccountStatus }) {
  const s = statusStyle[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        flexShrink: 0,
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: "11px",
        fontWeight: 600,
        color: s.color,
        background: s.bg,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
      {s.label}
    </span>
  );
}

interface AccountSelectorProps {
  accounts: Account[];
  current: Account;
  onSelect: (account: Account) => void;
}

export function AccountSelector({ accounts, current, onSelect }: AccountSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const groups = kindOrder
    .map((kind) => ({ kind, items: accounts.filter((a) => a.kind === kind) }))
    .filter((g) => g.items.length > 0);

  return (
    <div ref={ref} style={{ position: "relative", padding: "0 16px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Current account ${current.planName} ${formatSize(current.size)}, ${statusStyle[current.status].label}. Switch account.`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          width: "100%",
        }}
      >
        <span style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {current.planName} · {formatSize(current.size)}
          </span>
          <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
            {phaseLabel[current.phase]} · {current.platform}
          </span>
        </span>
        <StatusPill status={current.status} />
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select account"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 16,
            right: 16,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-strong)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            zIndex: 20,
            overflow: "hidden",
            maxHeight: 320,
            overflowY: "auto",
            animation: "fadeIn 0.12s ease-out",
          }}
        >
          {groups.map((group) => (
            <div key={group.kind}>
              <div
                style={{
                  padding: "8px 14px 4px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {kindLabel[group.kind]}
              </div>
              {group.items.map((account) => {
                const selected = account.id === current.id;
                return (
                  <button
                    key={account.id}
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onSelect(account);
                      setOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "9px 14px",
                      textAlign: "left",
                      background: selected ? "var(--color-accent-soft)" : "transparent",
                    }}
                  >
                    <span
                      aria-hidden
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
                      <span style={{ fontSize: "10px", color: "var(--color-text-muted)" }}>
                        {phaseLabel[account.phase]} · {account.platform}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
