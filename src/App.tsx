import { useState, useEffect, useCallback } from "react";
import { Account } from "./types/account";
import { fetchAccounts, refreshAccount } from "./services/mockAccountService";
import { Header } from "./components/Header";
import { AccountSelector } from "./components/AccountSelector";
import { AccountSummary } from "./components/AccountSummary";
import { MetricCard } from "./components/MetricCard";
import { StatusBadge } from "./components/StatusBadge";
import { Timestamp } from "./components/Timestamp";
import { DashboardButton } from "./components/DashboardButton";
import { LoadingState, ErrorState } from "./components/EmptyStates";

type AppState = "loading" | "ready" | "error";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function App() {
  const [state, setState] = useState<AppState>("loading");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const currentAccount = accounts.find((a) => a.id === selectedId) ?? null;

  const loadAccounts = useCallback(async () => {
    setState("loading");
    try {
      const data = await fetchAccounts();
      setAccounts(data);
      setSelectedId(data[0]?.id ?? null);
      setLastUpdated(new Date());
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleRefresh = useCallback(async () => {
    if (!currentAccount || refreshing) return;
    setRefreshing(true);
    try {
      const updated = await refreshAccount(currentAccount);
      setAccounts((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      setLastUpdated(new Date());
    } catch {
      /* swallow — keep showing stale data */
    } finally {
      setRefreshing(false);
    }
  }, [currentAccount, refreshing]);

  const handleSelectAccount = useCallback(
    (account: Account) => {
      setSelectedId(account.id);
      setLastUpdated(new Date());
    },
    []
  );

  if (state === "loading") return <LoadingState />;
  if (state === "error") return <ErrorState onRetry={loadAccounts} />;
  if (!currentAccount) return <ErrorState onRetry={loadAccounts} />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        minHeight: 480,
      }}
    >
      <Header onRefresh={handleRefresh} refreshing={refreshing} />
      <AccountSelector
        accounts={accounts}
        current={currentAccount}
        onSelect={handleSelectAccount}
      />
      <AccountSummary account={currentAccount} />

      <div
        style={{
          padding: "20px 20px 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <MetricCard
          label="Daily DD Remaining"
          value={formatCurrency(currentAccount.dailyDrawdownRemaining)}
        />
        <MetricCard
          label="Max DD Remaining"
          value={formatCurrency(currentAccount.maxDrawdownRemaining)}
        />
      </div>

      <div style={{ padding: "12px 0 0" }}>
        <StatusBadge status={currentAccount.status} />
      </div>

      <Timestamp lastUpdated={lastUpdated} />

      <div style={{ marginTop: "auto" }}>
        <DashboardButton />
      </div>
    </div>
  );
}
