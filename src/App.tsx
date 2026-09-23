import { useState, useEffect, useCallback } from "react";
import { Account } from "./types/account";
import { fetchAccounts, refreshAccount } from "./services/mockAccountService";
import { Header } from "./components/Header";
import { AccountSelector } from "./components/AccountSelector";
import { AccountSummary } from "./components/AccountSummary";
import { DrawdownSafety } from "./components/DrawdownSafety";
import { ProgressBar } from "./components/ProgressBar";
import { DetailsSection } from "./components/DetailsSection";
import { UpdatedLabel } from "./components/UpdatedLabel";
import { DashboardButton } from "./components/DashboardButton";
import { formatCurrency } from "./lib/format";
import { LoadingState, ErrorState, NoAccountState } from "./components/EmptyStates";

type AppState = "loading" | "ready" | "error";

export default function App() {
  const [state, setState] = useState<AppState>("loading");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const current = accounts.find((a) => a.id === selectedId) ?? null;

  const loadAccounts = useCallback(async () => {
    setState("loading");
    try {
      const data = await fetchAccounts();
      setAccounts(data);
      setSelectedId((prev) => prev ?? data[0]?.id ?? null);
      setLastUpdated(new Date());
      setState(data.length > 0 ? "ready" : "error");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleRefresh = useCallback(async () => {
    if (!current || refreshing) return;
    setRefreshing(true);
    try {
      const updated = await refreshAccount(current);
      setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setLastUpdated(new Date());
    } catch {
      /* keep stale data on failure */
    } finally {
      setRefreshing(false);
    }
  }, [current, refreshing]);

  const handleSelect = useCallback((account: Account) => {
    setSelectedId(account.id);
    setLastUpdated(new Date());
  }, []);

  if (state === "loading") return <LoadingState />;
  if (state === "error" && accounts.length === 0) return <NoAccountState />;
  if (!current) return <ErrorState onRetry={loadAccounts} />;

  const showProfitTarget =
    current.profitTarget && current.profitTarget.target > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 480 }}>
      <Header onRefresh={handleRefresh} refreshing={refreshing} />

      <AccountSelector accounts={accounts} current={current} onSelect={handleSelect} />

      <div style={{ height: 14 }} />
      <AccountSummary account={current} />

      <div style={{ height: 16 }} />
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <DrawdownSafety account={current} />
        {showProfitTarget && (
          <ProgressBar
            label="Profit Target"
            percent={(current.profitTarget!.current / current.profitTarget!.target) * 100}
            caption={`${formatCurrency(Math.max(0, current.profitTarget!.current), 0)} / ${formatCurrency(current.profitTarget!.target, 0)}`}
            color="var(--color-positive)"
          />
        )}
      </div>

      <div style={{ height: 8 }} />
      <DetailsSection account={current} />

      <UpdatedLabel lastUpdated={lastUpdated} />

      <div style={{ marginTop: "auto", paddingTop: 8 }}>
        <DashboardButton />
      </div>
    </div>
  );
}
