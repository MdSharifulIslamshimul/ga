import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

const iconButton: React.CSSProperties = {
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--color-border)",
  background: "var(--color-surface)",
};

export function Header({ onRefresh, refreshing }: HeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 16px 12px",
      }}
    >
      <span style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.01em" }}>
        FUNDED
        <span style={{ color: "var(--color-accent)" }}>NEXT</span>
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <ThemeToggle />
        <button
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh account data"
          style={iconButton}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              animation: refreshing ? "spin 0.8s linear infinite" : "none",
              opacity: refreshing ? 0.5 : 1,
            }}
          >
            <path
              d="M13.65 2.35A7.96 7.96 0 0 0 8 0a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24L10 6h6V0l-2.35 2.35Z"
              fill="var(--color-text-secondary)"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
