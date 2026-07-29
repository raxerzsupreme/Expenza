import { create } from 'zustand';
import type { Expense, Category } from '@/types';

interface AppState {
  // Expenses
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: number) => void;

  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: number) => void;

  // UI State
  isExpenseModalOpen: boolean;
  editingExpense: Expense | null;
  openExpenseModal: (expense?: Expense) => void;
  closeExpenseModal: () => void;

  isCategoryModalOpen: boolean;
  editingCategory: Category | null;
  openCategoryModal: (category?: Category) => void;
  closeCategoryModal: () => void;

  // Filters
  dateRange: { from: Date | null; to: Date | null };
  selectedCategory: number | null;
  searchQuery: string;
  setDateRange: (range: { from: Date | null; to: Date | null }) => void;
  setSelectedCategory: (categoryId: number | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Expenses
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
  updateExpense: (expense) =>
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === expense.id ? expense : e)),
    })),
  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    })),

  // Categories
  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (category) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? category : c)),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  // UI State
  isExpenseModalOpen: false,
  editingExpense: null,
  openExpenseModal: (expense) =>
    set({ isExpenseModalOpen: true, editingExpense: expense || null }),
  closeExpenseModal: () => set({ isExpenseModalOpen: false, editingExpense: null }),

  isCategoryModalOpen: false,
  editingCategory: null,
  openCategoryModal: (category) =>
    set({ isCategoryModalOpen: true, editingCategory: category || null }),
  closeCategoryModal: () => set({ isCategoryModalOpen: false, editingCategory: null }),

  // Filters
  dateRange: { from: null, to: null },
  selectedCategory: null,
  searchQuery: '',
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
