import { useState, useEffect } from "react";

interface TimestampProps {
  lastUpdated: Date | null;
}

function formatElapsed(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "Updated just now";
  if (seconds < 60) return `Updated ${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "Updated 1 min ago";
  return `Updated ${minutes} min ago`;
}

export function Timestamp({ lastUpdated }: TimestampProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "12px 20px",
        fontSize: "11px",
        color: "var(--color-text-muted)",
      }}
    >
      {lastUpdated ? formatElapsed(lastUpdated) : "Loading..."}
    </div>
  );
}
