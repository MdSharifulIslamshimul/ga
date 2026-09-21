import { DASHBOARD_URL } from "../constants";

export function DashboardButton() {
  function handleClick() {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url: DASHBOARD_URL });
    } else {
      window.open(DASHBOARD_URL, "_blank");
    }
  }

  return (
    <div style={{ padding: "0 20px 20px" }}>
      <button
        onClick={handleClick}
        aria-label="Open full FundedNext dashboard in a new tab"
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--color-accent)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "var(--color-bg)";
          el.style.borderColor = "var(--color-text-muted)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "var(--color-surface)";
          el.style.borderColor = "var(--color-border)";
        }}
      >
        Open Full Dashboard
        <span style={{ fontSize: "14px" }}>→</span>
      </button>
    </div>
  );
}
