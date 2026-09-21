import { useState, useRef, useEffect } from "react";
import { Account } from "../types/account";

function formatSize(size: number): string {
  return `$${(size / 1000).toFixed(0)}K`;
}

interface AccountSelectorProps {
  accounts: Account[];
  current: Account;
  onSelect: (account: Account) => void;
}

export function AccountSelector({
  accounts,
  current,
  onSelect,
}: AccountSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", padding: "0 20px" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Current account: ${current.name} ${formatSize(current.size)}. Click to switch accounts.`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          width: "100%",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "var(--color-text-muted)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "var(--color-border)";
        }}
      >
        <span
          style={{
            flex: 1,
            textAlign: "left",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          {current.name}
          <span
            style={{
              fontWeight: 400,
              color: "var(--color-text-secondary)",
              marginLeft: 6,
            }}
          >
            · {formatSize(current.size)}
          </span>
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="var(--color-text-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select account"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 20,
            right: 20,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            zIndex: 10,
            overflow: "hidden",
            animation: "fadeIn 0.12s ease-out",
          }}
        >
          {accounts.map((account) => {
            const isSelected = account.id === current.id;
            return (
              <button
                key={account.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelect(account);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: "13px",
                  background: isSelected
                    ? "var(--color-bg)"
                    : "var(--color-surface)",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--color-bg)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--color-surface)";
                }}
              >
                <span style={{ fontWeight: isSelected ? 600 : 400 }}>
                  {account.name}
                </span>
                <span
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  {formatSize(account.size)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
