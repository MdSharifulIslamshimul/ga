export type AccountKind = "cfd" | "futures" | "competition";

export type Platform = "MT5" | "CTRADER" | "TRADOVATE";

export type Phase =
  | "challenge_p1"
  | "challenge_p2"
  | "funded"
  | "competition";

export type AccountStatus = "active" | "paused" | "breached" | "passed";

export type Verdict = "clean" | "warning" | "violation";

/**
 * A loss-limit buffer (Daily Loss Limit or Max Loss Limit).
 * `limit` is the total allowance in dollars, `remaining` is how much is
 * still available before breach, `percentTarget` is the rule threshold
 * (e.g. -4% daily, -8% max). Mirrors the API `objectives.daily_loss` /
 * `objectives.overall_loss` blocks.
 */
export interface LossBuffer {
  limit: number;
  remaining: number;
  percentTarget?: number;
}

/** Profit target progress — mirrors API `objectives.profit_target`. */
export interface ProfitTarget {
  target: number;
  current: number;
}

/** Min trading days progress — mirrors API `objectives.min_trading_days`. */
export interface MinTradingDays {
  required: number;
  completed: number;
}

/** Consistency rule state — mirrors API `objectives.consistency`. */
export interface Consistency {
  status: Verdict | "not_applicable";
  requiredProfit?: number;
  highestProfit?: number;
  percent?: number;
}

/** Futures-only inactivity limit. */
export interface MaxInactiveDays {
  limit: number;
  used: number;
}

/** Funded-only risk card verdicts — mirrors `get_risk_card`. */
export interface RiskCard {
  quickStrike: { verdict: Verdict; percent: number };
  riskLimit: { verdict: Verdict; percent: number };
  newsTrade: { verdict: Verdict; deducted: number };
}

/** Competition-only leaderboard position. */
export interface Leaderboard {
  rank: number;
  participants: number;
}

export interface Account {
  id: string;
  login: string;
  kind: AccountKind;
  planName: string;
  size: number;
  platform: Platform;
  phase: Phase;
  status: AccountStatus;
  pausedReason?: string;

  initialBalance: number;
  balance: number;
  equity: number;
  profitLoss: number;
  floatingPnl: number;

  profitTarget?: ProfitTarget;
  dailyLossLimit?: LossBuffer;
  maxLossLimit?: LossBuffer;
  minTradingDays?: MinTradingDays;
  consistency?: Consistency;
  maxInactiveDays?: MaxInactiveDays;

  cycleStart: string;
  cycleEnd: string | "unlimited";
  payoutEligibleDate?: string;

  riskCard?: RiskCard;
  leaderboard?: Leaderboard;

  updatedAt: string;
}
