export type ExpenseCategory =
  | "Transportation"
  | "Dining"
  | "Entertainment"
  | "Housing"
  | "Food"
  | "Shopping"
  | "Health"
  | "Education"
  | "Utilities"
  | "Other";

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSettings {
  monthlyBudget: number;
  yearlyBudget: number;
}

export interface AppState {
  expenses: Expense[];
  budget: BudgetSettings;
  isInitialized: boolean;
}

export type DateFilter = "this-month" | "last-month" | "year-to-date" | "custom";

export interface CustomDateRange {
  from: string;
  to: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Transportation",
  "Dining",
  "Entertainment",
  "Housing",
  "Food",
  "Shopping",
  "Health",
  "Education",
  "Utilities",
  "Other",
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Transportation: "#3b82f6",
  Dining: "#f59e0b",
  Entertainment: "#8b5cf6",
  Housing: "#ef4444",
  Food: "#10b981",
  Shopping: "#ec4899",
  Health: "#06b6d4",
  Education: "#6366f1",
  Utilities: "#84cc16",
  Other: "#6b7280",
};
