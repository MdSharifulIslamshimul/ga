import { Account, LossBuffer } from "../types/account";
import { HEALTH_THRESHOLDS } from "../constants";

export type HealthLevel = "safe" | "caution" | "danger" | "breached";

export interface Health {
  level: HealthLevel;
  /** Worst (highest) buffer-consumed percentage across DLL and MLL, 0-100. */
  worstConsumedPct: number;
}

/** Fraction of a loss buffer already consumed, 0-1. */
export function consumedFraction(buffer: LossBuffer): number {
  if (buffer.limit <= 0) return 0;
  const consumed = (buffer.limit - buffer.remaining) / buffer.limit;
  return Math.min(1, Math.max(0, consumed));
}

export function getHealth(account: Account): Health {
  if (account.status === "breached") {
    return { level: "breached", worstConsumedPct: 100 };
  }

  const buffers = [account.dailyLossLimit, account.maxLossLimit].filter(
    (b): b is LossBuffer => Boolean(b)
  );

  const worstConsumedPct =
    buffers.length === 0
      ? 0
      : Math.max(...buffers.map((b) => consumedFraction(b) * 100));

  let level: HealthLevel = "safe";
  if (worstConsumedPct >= HEALTH_THRESHOLDS.danger) level = "danger";
  else if (worstConsumedPct >= HEALTH_THRESHOLDS.caution) level = "caution";

  return { level, worstConsumedPct };
}

export interface PortfolioSummary {
  total: number;
  nearBreach: number;
  breached: number;
}

export function getPortfolioSummary(accounts: Account[]): PortfolioSummary {
  let nearBreach = 0;
  let breached = 0;
  for (const account of accounts) {
    const health = getHealth(account);
    if (health.level === "breached") breached += 1;
    else if (health.level === "caution" || health.level === "danger")
      nearBreach += 1;
  }
  return { total: accounts.length, nearBreach, breached };
}
