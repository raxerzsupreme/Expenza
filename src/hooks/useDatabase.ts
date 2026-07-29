'use client';

import { useEffect, useCallback } from 'react';
import { db, seedCategories } from '@/lib/db';
import { useAppStore } from '@/lib/store';
import type { Expense, Category } from '@/types';

export function useDatabase() {
  const {
    setExpenses,
    setCategories,
    addExpense: storeAddExpense,
    updateExpense: storeUpdateExpense,
    deleteExpense: storeDeleteExpense,
    addCategory: storeAddCategory,
    updateCategory: storeUpdateCategory,
    deleteCategory: storeDeleteCategory,
  } = useAppStore();

  // Initialize database and seed categories
  useEffect(() => {
    const init = async () => {
      await seedCategories();
      const categories = await db.categories.toArray();
      setCategories(categories);
      const expenses = await db.expenses.toArray();
      setExpenses(expenses);
    };
    init();
  }, [setCategories, setExpenses]);

  // Expense operations
  const addExpense = useCallback(
    async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
      const newExpense: Expense = {
        ...expense,
        createdAt: new Date(),
      };
      const id = await db.expenses.add(newExpense);
      const fullExpense = { ...newExpense, id };
      storeAddExpense(fullExpense);
      return fullExpense;
    },
    [storeAddExpense]
  );

  const updateExpense = useCallback(
    async (expense: Expense) => {
      await db.expenses.update(expense.id!, expense);
      storeUpdateExpense(expense);
    },
    [storeUpdateExpense]
  );

  const deleteExpense = useCallback(
    async (id: number) => {
      await db.expenses.delete(id);
      storeDeleteExpense(id);
    },
    [storeDeleteExpense]
  );

  // Category operations
  const addCategory = useCallback(
    async (category: Omit<Category, 'id' | 'createdAt'>) => {
      const newCategory: Category = {
        ...category,
        createdAt: new Date(),
      };
      const id = await db.categories.add(newCategory);
      const fullCategory = { ...newCategory, id };
      storeAddCategory(fullCategory);
      return fullCategory;
    },
    [storeAddCategory]
  );

  const updateCategory = useCallback(
    async (category: Category) => {
      await db.categories.update(category.id!, category);
      storeUpdateCategory(category);
    },
    [storeUpdateCategory]
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      await db.categories.delete(id);
      storeDeleteCategory(id);
    },
    [storeDeleteCategory]
  );

  return {
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
