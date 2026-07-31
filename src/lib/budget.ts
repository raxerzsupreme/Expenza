import type { Category } from '@/types';

export interface CategoryLimit {
  categoryId: number;
  limit: number;
}

export interface Budget {
  id: string;
  period: string;
  totalAmount: number;
  categoryLimits: CategoryLimit[];
  createdAt: string;
}

const STORAGE_KEY = 'expenza_budgets';

export function getBudgets(): Budget[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBudget(budget: Budget): void {
  const budgets = getBudgets();
  const existingIndex = budgets.findIndex((b) => b.period === budget.period);
  if (existingIndex >= 0) {
    budgets[existingIndex] = budget;
  } else {
    budgets.push(budget);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
}

export function deleteBudget(id: string): void {
  const budgets = getBudgets().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
}

export function getBudgetForPeriod(period: string): Budget | undefined {
  return getBudgets().find((b) => b.period === period);
}

export function getCurrentPeriod(): string {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();
  return `${month} ${year}`;
}

export function generatePeriodOptions(): string[] {
  const options: string[] = [];
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    options.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
  }

  for (let i = 0; i < 3; i++) {
    options.push(`Year ${now.getFullYear() + i}`);
  }

  return options;
}

export function computeBudgetProgress(
  totalSpent: number,
  budget: Budget | undefined
): { percentage: number; color: string; status: string } {
  if (!budget || budget.totalAmount <= 0) {
    return { percentage: 0, color: 'bg-slate-300', status: 'No budget set' };
  }

  const percentage = Math.min((totalSpent / budget.totalAmount) * 100, 100);

  let color: string;
  let status: string;

  if (percentage >= 100) {
    color = 'bg-rose-500';
    status = 'Over budget';
  } else if (percentage >= 80) {
    color = 'bg-amber-500';
    status = 'Approaching limit';
  } else {
    color = 'bg-emerald-500';
    status = 'On track';
  }

  return { percentage, color, status };
}

export function computeCategorySpending(
  expenses: { categoryId: number; amount: number; date: Date }[],
  period: string,
  categories: Category[]
): { category: Category; spent: number; limit: number }[] {
  const budget = getBudgetForPeriod(period);
  if (!budget) return [];

  const now = new Date();
  const isYearly = period.startsWith('Year');

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    if (isYearly) {
      return date.getFullYear() === now.getFullYear();
    }
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  const spendingByCategory: Record<number, number> = {};
  filteredExpenses.forEach((e) => {
    spendingByCategory[e.categoryId] = (spendingByCategory[e.categoryId] || 0) + e.amount;
  });

  return categories.map((cat) => {
    const limitEntry = budget.categoryLimits.find((cl) => cl.categoryId === cat.id);
    return {
      category: cat,
      spent: spendingByCategory[cat.id!] || 0,
      limit: limitEntry?.limit || 0,
    };
  });
}
