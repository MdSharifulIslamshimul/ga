import { Leaderboard } from "../types/account";
import { formatCompact } from "../lib/format";

export function LeaderboardRow({ leaderboard }: { leaderboard: Leaderboard }) {
  const percentile = Math.max(
    1,
    Math.round((leaderboard.rank / leaderboard.participants) * 100)
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div>
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
          Leaderboard
        </div>
        <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
          of {formatCompact(leaderboard.participants)} traders · top {percentile}%
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 2,
          fontWeight: 700,
          color: "var(--color-accent)",
        }}
      >
        <span style={{ fontSize: "13px" }}>#</span>
        <span style={{ fontSize: "20px" }}>
          {leaderboard.rank.toLocaleString("en-US")}
        </span>
      </div>
    </div>
  );
}
