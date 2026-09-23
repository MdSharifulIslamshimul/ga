import { Account, Verdict } from "../types/account";
import { RiskGauge } from "./RiskGauge";
import { ProgressBar } from "./ProgressBar";
import { MetricCard } from "./MetricCard";
import { RiskCardRow } from "./RiskCardRow";
import { LeaderboardRow } from "./LeaderboardRow";
import { formatCurrency, formatSize } from "../lib/format";

const stack: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

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

function DateCaption(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ObjectivesList({ account }: { account: Account }) {
  const {
    kind,
    dailyLossLimit,
    maxLossLimit,
    profitTarget,
    minTradingDays,
    consistency,
    maxInactiveDays,
    riskCard,
    leaderboard,
    payoutEligibleDate,
  } = account;

  return (
    <div style={stack}>
      {/* Breach-safety gauges */}
      {dailyLossLimit && maxLossLimit ? (
        <div style={grid}>
          <RiskGauge label="Daily Loss" buffer={dailyLossLimit} />
          <RiskGauge label="Max Loss" buffer={maxLossLimit} />
        </div>
      ) : (
        maxLossLimit && <RiskGauge label="Max Loss" buffer={maxLossLimit} />
      )}

      {/* Profit target */}
      {profitTarget && profitTarget.target > 0 && (
        <ProgressBar
          label="Profit Target"
          percent={(profitTarget.current / profitTarget.target) * 100}
          caption={`${formatCurrency(Math.max(0, profitTarget.current), 0)} / ${formatCurrency(profitTarget.target, 0)}`}
          color="var(--color-positive)"
        />
      )}

      {/* Min trading days */}
      {minTradingDays && (
        <ProgressBar
          label="Min Trading Days"
          percent={(minTradingDays.completed / minTradingDays.required) * 100}
          caption={`${minTradingDays.completed} / ${minTradingDays.required} days`}
        />
      )}

      {/* Futures: max inactive days */}
      {maxInactiveDays && (
        <ProgressBar
          label="Max Inactive Days"
          percent={(maxInactiveDays.used / maxInactiveDays.limit) * 100}
          caption={`${maxInactiveDays.used} / ${maxInactiveDays.limit} days`}
          color="var(--color-caution)"
        />
      )}

      {/* Consistency + payout (2-up where both present) */}
      {(consistency || payoutEligibleDate) && (
        <div style={consistency && payoutEligibleDate ? grid : undefined}>
          {consistency && (
            <MetricCard
              label="Consistency"
              value={consistencyLabel[consistency.status]}
              valueColor={consistencyColor[consistency.status]}
              caption={
                kind === "futures" && consistency.requiredProfit !== undefined
                  ? `Req ${formatSize(consistency.requiredProfit)} · high $${consistency.highestProfit ?? 0}`
                  : consistency.percent !== undefined
                    ? `${consistency.percent}% of limit`
                    : undefined
              }
            />
          )}
          {payoutEligibleDate && (
            <MetricCard
              label="Payout Eligible"
              value={DateCaption(payoutEligibleDate)}
              valueColor="var(--color-accent)"
            />
          )}
        </div>
      )}

      {/* Funded risk card */}
      {riskCard && <RiskCardRow riskCard={riskCard} />}

      {/* Competition leaderboard */}
      {leaderboard && <LeaderboardRow leaderboard={leaderboard} />}
    </div>
  );
}
