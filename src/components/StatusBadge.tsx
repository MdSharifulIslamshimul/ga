import { Account } from "../types/account";

const statusConfig: Record<
  Account["status"],
  { label: string; color: string }
> = {
  active: { label: "Active", color: "var(--color-active)" },
  breached: { label: "Breached", color: "var(--color-negative)" },
  paused: { label: "Paused", color: "var(--color-text-muted)" },
};

interface StatusBadgeProps {
  status: Account["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div style={{ padding: "0 20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
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
          Account Status
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "13px",
            fontWeight: 600,
            color: config.color,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: config.color,
            }}
          />
          {config.label}
        </span>
      </div>
    </div>
  );
}
