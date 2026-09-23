import { Account, LossBuffer } from "../types/account";
import { mockAccounts } from "../data/mockAccounts";

/**
 * Mock account service. Every function maps 1:1 to a real FundedNext API
 * call so this file is the ONLY place to change when wiring the real API:
 *
 *   fetchAccounts()          -> get_customer_portfolio_rollup / get_accounts_v2
 *   fetchAccount(id)         -> get_account_overview (+ get_risk_card for funded)
 *   refreshAccount(account)  -> get_account_overview (re-poll)
 *
 * The Account type already mirrors the API's objectives schema, so the UI
 * needs no changes.
 */

// In-memory store so refreshes persist across calls within a popup session.
let store: Account[] = mockAccounts.map((a) => ({ ...a }));

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(range: number): number {
  return (Math.random() - 0.5) * 2 * range;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function adjustBuffer(buffer: LossBuffer, equityDelta: number): LossBuffer {
  // A loss reduces remaining buffer; a gain restores it (capped at the limit).
  const remaining = Math.min(
    buffer.limit,
    Math.max(0, buffer.remaining + equityDelta)
  );
  return { ...buffer, remaining: round2(remaining) };
}

function simulateUpdate(account: Account): Account {
  if (account.status === "breached" || account.status === "paused") {
    return { ...account, updatedAt: new Date().toISOString() };
  }

  const equityDelta = round2(jitter(account.size * 0.004));
  const newEquity = round2(account.equity + equityDelta);
  const newBalance = round2(account.balance + equityDelta);
  const profitLoss = round2(newBalance - account.initialBalance);

  return {
    ...account,
    equity: newEquity,
    balance: newBalance,
    profitLoss,
    floatingPnl: round2(jitter(account.size * 0.001)),
    profitTarget: account.profitTarget
      ? { ...account.profitTarget, current: profitLoss }
      : undefined,
    dailyLossLimit: account.dailyLossLimit
      ? adjustBuffer(account.dailyLossLimit, equityDelta)
      : undefined,
    maxLossLimit: account.maxLossLimit
      ? adjustBuffer(account.maxLossLimit, equityDelta)
      : undefined,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchAccounts(): Promise<Account[]> {
  await delay(300);
  return store.map((a) => ({ ...a }));
}

export async function fetchAccount(id: string): Promise<Account | null> {
  await delay(200);
  const account = store.find((a) => a.id === id);
  return account ? { ...account } : null;
}

export async function refreshAccount(account: Account): Promise<Account> {
  await delay(400 + Math.random() * 300);
  const updated = simulateUpdate(account);
  store = store.map((a) => (a.id === updated.id ? updated : a));
  return { ...updated };
}
