import Dexie, { type Table } from 'dexie';
import type { Category, Expense } from '@/types';

export class ExpenzaDatabase extends Dexie {
  categories!: Table<Category, number>;
  expenses!: Table<Expense, number>;

  constructor() {
    super('expenza数据库');
    this.version(1).stores({
      categories: '++id, name, createdAt',
      expenses: '++id, categoryId, date, createdAt',
    });
  }
}

export const db = new ExpenzaDatabase();

// Default categories
export const defaultCategories: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#f97316' },
  { name: 'Transport', icon: 'Car', color: '#3b82f6' },
  { name: 'Bills & Utilities', icon: 'Receipt', color: '#8b5cf6' },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899' },
  { name: 'Entertainment', icon: 'Gamepad2', color: '#ef4444' },
  { name: 'Health & Fitness', icon: 'Heart', color: '#22c55e' },
  { name: 'Education', icon: 'GraduationCap', color: '#0D9488' },
  { name: 'Other', icon: 'MoreHorizontal', color: '#64748b' },
];

// Seed default categories if empty
export async function seedCategories() {
  const count = await db.categories.count();
  if (count === 0) {
    await db.categories.bulkAdd(
      defaultCategories.map((cat) => ({
        ...cat,
        createdAt: new Date(),
      }))
    );
  }
}
