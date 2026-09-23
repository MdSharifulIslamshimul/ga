import { useState } from "react";
import { Theme, getInitialTheme, setTheme } from "../lib/theme";

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

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={iconButton}
    >
      {isDark ? (
        // moon
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z"
            fill="var(--color-text-secondary)"
          />
        </svg>
      ) : (
        // sun
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3.2" fill="var(--color-text-secondary)" />
          <g stroke="var(--color-text-secondary)" strokeWidth="1.3" strokeLinecap="round">
            <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M13 3l-1.1 1.1M4.1 11.9 3 13" />
          </g>
        </svg>
      )}
    </button>
  );
}
