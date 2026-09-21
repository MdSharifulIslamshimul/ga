import { DASHBOARD_URL } from "../constants";

export function LoadingState() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 400,
        color: "var(--color-text-secondary)",
        fontSize: "14px",
      }}
    >
      Loading account...
    </div>
  );
}

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 400,
        gap: 16,
        padding: 20,
      }}
    >
      <span
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "14px",
        }}
      >
        Couldn't load account
      </span>
      <button
        onClick={onRetry}
        style={{
          padding: "10px 24px",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--color-surface)",
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
        Try again
      </button>
    </div>
  );
}

export function NoAccountState() {
  function handleOpen() {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url: DASHBOARD_URL });
    } else {
      window.open(DASHBOARD_URL, "_blank");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 400,
        gap: 16,
        padding: 20,
      }}
    >
      <span
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "14px",
        }}
      >
        No FundedNext account found.
      </span>
      <button
        onClick={handleOpen}
        style={{
          padding: "10px 24px",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--color-surface)",
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
        Open Dashboard
      </button>
    </div>
  );
}
