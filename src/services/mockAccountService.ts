import { Account } from "../types/account";
import { mockAccounts } from "../data/mockAccounts";

function jitter(value: number, range: number): number {
  const delta = (Math.random() - 0.5) * 2 * range;
  return Math.round((value + delta) * 100) / 100;
}

function simulateUpdate(account: Account): Account {
  const balanceShift = jitter(0, account.size * 0.005);
  const newBalance = Math.round((account.balance + balanceShift) * 100) / 100;
  const newProfit = Math.round((newBalance - account.size) * 100) / 100;
  const newProfitPct =
    Math.round((newProfit / account.size) * 100 * 100) / 100;

  return {
    ...account,
    balance: newBalance,
    profit: newProfit,
    profitPercentage: newProfitPct,
    dailyDrawdownRemaining: Math.max(
      0,
      Math.round(account.dailyDrawdownRemaining + jitter(0, 50))
    ),
    maxDrawdownRemaining: Math.max(
      0,
      Math.round(account.maxDrawdownRemaining + jitter(0, 30))
    ),
  };
}

export async function fetchAccounts(): Promise<Account[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockAccounts];
}

export async function refreshAccount(account: Account): Promise<Account> {
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300));
  return simulateUpdate(account);
}
