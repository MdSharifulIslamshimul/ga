export interface Account {
  id: string;
  name: string;
  size: number;
  balance: number;
  profit: number;
  profitPercentage: number;
  dailyDrawdownRemaining: number;
  maxDrawdownRemaining: number;
  status: "active" | "breached" | "paused";
}
