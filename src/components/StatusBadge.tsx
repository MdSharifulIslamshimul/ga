import { Account, AccountStatus } from "../types/account";

const config: Record<
  AccountStatus,
  { label: string; color: string; bg: string }
> = {
  active: {
    label: "Active",
    color: "var(--color-positive)",
    bg: "var(--color-positive-bg)",
  },
  paused: {
    label: "Paused",
    color: "var(--color-caution)",
    bg: "var(--color-caution-bg)",
  },
  breached: {
    label: "Breached",
    color: "var(--color-negative)",
    bg: "var(--color-negative-bg)",
  },
  passed: {
    label: "Passed",
    color: "var(--color-accent)",
    bg: "var(--color-accent-soft)",
  },
};

export function StatusBadge({ account }: { account: Account }) {
  const c = config[account.status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "12px 14px",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--color-text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Account Status
        </div>
        {account.pausedReason && (
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-text-muted)",
              marginTop: 3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {account.pausedReason}
          </div>
        )}
      </div>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          padding: "4px 10px",
          borderRadius: 20,
          fontSize: "12px",
          fontWeight: 600,
          color: c.color,
          background: c.bg,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: c.color,
          }}
        />
        {c.label}
      </span>
    </div>
  );
}
