import { useState, useEffect, useCallback } from "react";
import { Account } from "./types/account";
import { fetchAccounts, refreshAccount } from "./services/mockAccountService";
import { Header } from "./components/Header";
import { PortfolioStrip } from "./components/PortfolioStrip";
import { AccountSelector } from "./components/AccountSelector";
import { AccountSummary } from "./components/AccountSummary";
import { ObjectivesList } from "./components/ObjectivesList";
import { StatusBadge } from "./components/StatusBadge";
import { CycleFooter } from "./components/CycleFooter";
import { DashboardButton } from "./components/DashboardButton";
import { LoadingState, ErrorState, NoAccountState } from "./components/EmptyStates";

type AppState = "loading" | "ready" | "error";

const section: React.CSSProperties = { padding: "0 16px" };

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
      setAccounts((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
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

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 480 }}>
      <Header onRefresh={handleRefresh} refreshing={refreshing} />

      <PortfolioStrip
        accounts={accounts}
        currentId={current.id}
        onSelect={handleSelect}
      />

      <div style={{ height: 8 }} />
      <AccountSelector
        accounts={accounts}
        current={current}
        onSelect={handleSelect}
      />

      <div style={{ height: 12 }} />
      <AccountSummary account={current} />

      <div style={{ height: 14 }} />
      <div style={section}>
        <ObjectivesList account={current} />
      </div>

      <div style={{ height: 10 }} />
      <div style={section}>
        <StatusBadge account={current} />
      </div>

      <CycleFooter account={current} lastUpdated={lastUpdated} />

      <div style={{ marginTop: "auto" }}>
        <DashboardButton />
      </div>
    </div>
  );
}
