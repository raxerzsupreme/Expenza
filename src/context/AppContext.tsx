import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { Expense, BudgetSettings, AppState, ExpenseCategory, DateFilter, CustomDateRange } from "@/types";
import { storage } from "@/lib/storage";
import { generateId } from "@/lib/utils";

type Action =
  | { type: "ADD_EXPENSE"; payload: Omit<Expense, "id" | "createdAt" | "updatedAt"> }
  | { type: "UPDATE_EXPENSE"; payload: { id: string; updates: Partial<Expense> } }
  | { type: "DELETE_EXPENSE"; payload: string }
  | { type: "SET_BUDGET"; payload: BudgetSettings }
  | { type: "INITIALIZE"; payload: AppState }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "SET_DATE_FILTER"; payload: DateFilter }
  | { type: "SET_CUSTOM_DATE_RANGE"; payload: CustomDateRange }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY_FILTER"; payload: ExpenseCategory | "All" };

interface ContextState extends AppState {
  theme: "light" | "dark";
  dateFilter: DateFilter;
  customDateRange: CustomDateRange;
  searchQuery: string;
  categoryFilter: ExpenseCategory | "All";
  filteredExpenses: Expense[];
  totalSpentThisMonth: number;
  totalSpentThisYear: number;
  remainingMonthly: number;
  remainingYearly: number;
  monthlyPercentage: number;
  yearlyPercentage: number;
  dispatch: React.Dispatch<Action>;
}

const defaultDateRange: CustomDateRange = {
  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
  to: new Date().toISOString().split("T")[0],
};

function filterExpenses(
  expenses: Expense[],
  dateFilter: DateFilter,
  customDateRange: CustomDateRange,
  searchQuery: string,
  categoryFilter: ExpenseCategory | "All"
): Expense[] {
  const now = new Date();
  let filtered = [...expenses];

  switch (dateFilter) {
    case "this-month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      filtered = filtered.filter((e) => {
        const d = new Date(e.date);
        return d >= start && d <= end;
      });
      break;
    }
    case "last-month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      filtered = filtered.filter((e) => {
        const d = new Date(e.date);
        return d >= start && d <= end;
      });
      break;
    }
    case "year-to-date": {
      const start = new Date(now.getFullYear(), 0, 1);
      filtered = filtered.filter((e) => new Date(e.date) >= start);
      break;
    }
    case "custom": {
      const from = new Date(customDateRange.from);
      const to = new Date(customDateRange.to);
      filtered = filtered.filter((e) => {
        const d = new Date(e.date);
        return d >= from && d <= to;
      });
      break;
    }
  }

  if (categoryFilter !== "All") {
    filtered = filtered.filter((e) => e.category === categoryFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (e) =>
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.amount.toString().includes(q)
    );
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getMonthTotal(expenses: Expense[]): number {
  const now = new Date();
  return expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

function getYearTotal(expenses: Expense[]): number {
  const now = new Date();
  return expenses
    .filter((e) => new Date(e.date).getFullYear() === now.getFullYear())
    .reduce((sum, e) => sum + e.amount, 0);
}

function reducer(state: ContextState, action: Action): ContextState {
  switch (action.type) {
    case "ADD_EXPENSE": {
      const now = new Date().toISOString();
      const newExpense: Expense = {
        ...action.payload,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      const expenses = [newExpense, ...state.expenses];
      const newState = { ...state, expenses };
      storage.save({ expenses, budget: state.budget, isInitialized: true });
      return computeDerived(newState);
    }
    case "UPDATE_EXPENSE": {
      const expenses = state.expenses.map((e) =>
        e.id === action.payload.id
          ? { ...e, ...action.payload.updates, updatedAt: new Date().toISOString() }
          : e
      );
      const newState = { ...state, expenses };
      storage.save({ expenses, budget: state.budget, isInitialized: true });
      return computeDerived(newState);
    }
    case "DELETE_EXPENSE": {
      const expenses = state.expenses.filter((e) => e.id !== action.payload);
      const newState = { ...state, expenses };
      storage.save({ expenses, budget: state.budget, isInitialized: true });
      return computeDerived(newState);
    }
    case "SET_BUDGET": {
      const budget = action.payload;
      const newState = { ...state, budget };
      storage.save({ expenses: state.expenses, budget, isInitialized: true });
      return computeDerived(newState);
    }
    case "SET_THEME": {
      return { ...state, theme: action.payload };
    }
    case "SET_DATE_FILTER": {
      return { ...state, dateFilter: action.payload };
    }
    case "SET_CUSTOM_DATE_RANGE": {
      return { ...state, customDateRange: action.payload };
    }
    case "SET_SEARCH": {
      return { ...state, searchQuery: action.payload };
    }
    case "SET_CATEGORY_FILTER": {
      return { ...state, categoryFilter: action.payload };
    }
    case "INITIALIZE": {
      return computeDerived({ ...action.payload, theme: state.theme, dateFilter: "this-month", customDateRange: defaultDateRange, searchQuery: "", categoryFilter: "All" });
    }
    default:
      return state;
  }
}

function computeDerived(state: ContextState): ContextState {
  const filteredExpenses = filterExpenses(
    state.expenses,
    state.dateFilter,
    state.customDateRange,
    state.searchQuery,
    state.categoryFilter
  );
  const totalSpentThisMonth = getMonthTotal(state.expenses);
  const totalSpentThisYear = getYearTotal(state.expenses);
  const remainingMonthly = state.budget.monthlyBudget - totalSpentThisMonth;
  const remainingYearly = state.budget.yearlyBudget - totalSpentThisYear;
  const monthlyPercentage = Math.min((totalSpentThisMonth / state.budget.monthlyBudget) * 100, 100);
  const yearlyPercentage = Math.min((totalSpentThisYear / state.budget.yearlyBudget) * 100, 100);

  return {
    ...state,
    filteredExpenses,
    totalSpentThisMonth,
    totalSpentThisYear,
    remainingMonthly,
    remainingYearly,
    monthlyPercentage,
    yearlyPercentage,
  };
}

const AppContext = createContext<ContextState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    expenses: [],
    budget: { monthlyBudget: 0, yearlyBudget: 0 },
    isInitialized: false,
    theme: "light" as const,
    dateFilter: "this-month" as DateFilter,
    customDateRange: defaultDateRange,
    searchQuery: "",
    categoryFilter: "All" as ExpenseCategory | "All",
    filteredExpenses: [],
    totalSpentThisMonth: 0,
    totalSpentThisYear: 0,
    remainingMonthly: 0,
    remainingYearly: 0,
    monthlyPercentage: 0,
    yearlyPercentage: 0,
    dispatch: () => {},
  });

  useEffect(() => {
    const loaded = storage.load();
    dispatch({ type: "INITIALIZE", payload: loaded });
  }, []);

  useEffect(() => {
    localStorage.setItem("expenza_theme", "light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  const wrappedDispatch = useCallback(
    (action: Action) => {
      if (action.type === "SET_THEME") {
        localStorage.setItem("expenza_theme", action.payload);
      }
      dispatch(action);
    },
    []
  );

  const contextValue = {
    ...state,
    dispatch: wrappedDispatch,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
