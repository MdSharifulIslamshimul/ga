import { Account } from "../types/account";

export const mockAccounts: Account[] = [
  {
    id: "acc-001",
    name: "Stellar 2-Step",
    size: 100_000,
    balance: 103_420,
    profit: 3_420,
    profitPercentage: 3.42,
    dailyDrawdownRemaining: 1_580,
    maxDrawdownRemaining: 4_580,
    status: "active",
  },
  {
    id: "acc-002",
    name: "Stellar 1-Step",
    size: 50_000,
    balance: 51_840,
    profit: 1_840,
    profitPercentage: 3.68,
    dailyDrawdownRemaining: 920,
    maxDrawdownRemaining: 1_840,
    status: "active",
  },
  {
    id: "acc-003",
    name: "Challenge",
    size: 25_000,
    balance: 24_320,
    profit: -680,
    profitPercentage: -2.72,
    dailyDrawdownRemaining: 1_180,
    maxDrawdownRemaining: 1_820,
    status: "active",
  },
];
