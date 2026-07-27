import { Expense, BudgetSettings, AppState } from "@/types";
import { SEED_EXPENSES, SEED_BUDGET } from "./seed-data";

const STORAGE_KEY = "expenza_state";

function getInitialState(): AppState {
  return {
    expenses: SEED_EXPENSES,
    budget: SEED_BUDGET,
    isInitialized: true,
  };
}

export const storage = {
  load(): AppState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = getInitialState();
        this.save(initial);
        return initial;
      }
      return JSON.parse(raw) as AppState;
    } catch {
      const initial = getInitialState();
      this.save(initial);
      return initial;
    }
  },

  save(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  reset(): AppState {
    this.clear();
    const initial = getInitialState();
    this.save(initial);
    return initial;
  },
};
