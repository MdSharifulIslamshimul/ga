import { DASHBOARD_URL } from "../constants";

const wrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: 440,
  gap: 16,
  padding: 20,
  textAlign: "center",
};

const message: React.CSSProperties = {
  color: "var(--color-text-secondary)",
  fontSize: "14px",
};

function PrimaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 24px",
        fontSize: "13px",
        fontWeight: 600,
        color: "#fff",
        background: "var(--color-accent)",
        borderRadius: "var(--radius-sm)",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "var(--color-accent-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "var(--color-accent)";
      }}
    >
      {children}
    </button>
  );
}

export function LoadingState() {
  return (
    <div style={{ ...wrap, color: "var(--color-text-secondary)", fontSize: "14px" }}>
      Loading account...
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={wrap}>
      <span style={message}>Couldn't load account</span>
      <PrimaryButton onClick={onRetry}>Try again</PrimaryButton>
    </div>
  );
}

export function NoAccountState() {
  function openDashboard() {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url: DASHBOARD_URL });
    } else {
      window.open(DASHBOARD_URL, "_blank");
    }
  }
  return (
    <div style={wrap}>
      <span style={message}>No FundedNext account found.</span>
      <PrimaryButton onClick={openDashboard}>Open Dashboard</PrimaryButton>
    </div>
  );
}
