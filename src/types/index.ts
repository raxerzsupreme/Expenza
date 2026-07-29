export interface Category {
  id?: number;
  name: string;
  icon: string;
  color: string;
  budget?: number;
  createdAt: Date;
}

export interface Expense {
  id?: number;
  amount: number;
  categoryId: number;
  date: Date;
  note?: string;
  createdAt: Date;
}

export interface MonthlyStats {
  month: string;
  total: number;
  byCategory: { [key: number]: number };
}

export interface DashboardStats {
  totalThisMonth: number;
  budgetRemaining: number;
  transactionCount: number;
  dailySpending: { date: string; amount: number }[];
  categorySpending: { name: string; amount: number; color: string }[];
}
