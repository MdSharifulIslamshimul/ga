import { RiskCard, Verdict } from "../types/account";

const verdictColor: Record<Verdict, string> = {
  clean: "var(--color-positive)",
  warning: "var(--color-caution)",
  violation: "var(--color-negative)",
};

const verdictLabel: Record<Verdict, string> = {
  clean: "Clean",
  warning: "Warning",
  violation: "Violation",
};

function Item({
  label,
  verdict,
  detail,
}: {
  label: string;
  verdict: Verdict;
  detail: string;
}) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: "10px",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          marginBottom: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: "12px",
          fontWeight: 600,
          color: verdictColor[verdict],
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: verdictColor[verdict],
            flexShrink: 0,
          }}
        />
        {verdictLabel[verdict]}
      </div>
      <div style={{ fontSize: "10px", color: "var(--color-text-muted)", marginTop: 2 }}>
        {detail}
      </div>
    </div>
  );
}

export function RiskCardRow({ riskCard }: { riskCard: RiskCard }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 500,
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 10,
        }}
      >
        Risk Card
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Item
          label="Quick Strike"
          verdict={riskCard.quickStrike.verdict}
          detail={`${riskCard.quickStrike.percent}%`}
        />
        <Item
          label="Risk Limit"
          verdict={riskCard.riskLimit.verdict}
          detail={`${riskCard.riskLimit.percent}%`}
        />
        <Item
          label="News Trade"
          verdict={riskCard.newsTrade.verdict}
          detail={`$${riskCard.newsTrade.deducted}`}
        />
      </div>
    </div>
  );
}
