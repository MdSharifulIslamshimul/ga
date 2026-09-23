import { useState, useEffect } from "react";
import { Account } from "../types/account";

function formatElapsed(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "Updated just now";
  if (seconds < 60) return `Updated ${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  return minutes === 1 ? "Updated 1 min ago" : `Updated ${minutes} min ago`;
}

function cycleText(account: Account): string {
  const start = new Date(account.cycleStart).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  if (account.cycleEnd === "unlimited") return `Cycle: ${start} → Unlimited`;

  const end = new Date(account.cycleEnd);
  const endLabel = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const daysLeft = Math.ceil((end.getTime() - Date.now()) / 86_400_000);
  const left = daysLeft > 0 ? ` · ${daysLeft}d left` : "";
  return `Cycle: ${start} → ${endLabel}${left}`;
}

interface CycleFooterProps {
  account: Account;
  lastUpdated: Date | null;
}

export function CycleFooter({ account, lastUpdated }: CycleFooterProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        padding: "10px 16px 12px",
        fontSize: "11px",
        color: "var(--color-text-muted)",
      }}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {cycleText(account)}
      </span>
      <span style={{ flexShrink: 0 }}>
        {lastUpdated ? formatElapsed(lastUpdated) : ""}
      </span>
    </div>
  );
}
