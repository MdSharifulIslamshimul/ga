import { DASHBOARD_URL } from "../constants";

function openDashboard() {
  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.create({ url: DASHBOARD_URL });
  } else {
    window.open(DASHBOARD_URL, "_blank");
  }
}

export function DashboardButton() {
  return (
    <div style={{ padding: "0 16px 16px" }}>
      <button
        onClick={openDashboard}
        aria-label="Open full FundedNext dashboard in a new tab"
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "13px",
          fontWeight: 600,
          color: "#fff",
          background: "var(--color-accent)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
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
        Open Full Dashboard
        <span style={{ fontSize: "14px" }}>→</span>
      </button>
    </div>
  );
}
