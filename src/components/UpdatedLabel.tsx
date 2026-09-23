import { useState, useEffect } from "react";

function formatElapsed(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "Updated just now";
  if (seconds < 60) return `Updated ${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  return minutes === 1 ? "Updated 1 min ago" : `Updated ${minutes} min ago`;
}

export function UpdatedLabel({ lastUpdated }: { lastUpdated: Date | null }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  if (!lastUpdated) return null;

  return (
    <div
      style={{
        textAlign: "center",
        padding: "10px 16px 4px",
        fontSize: "11px",
        color: "var(--color-text-muted)",
      }}
    >
      {formatElapsed(lastUpdated)}
    </div>
  );
}
