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
  { name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#6366f1' },
  { name: 'Transport', icon: 'Car', color: '#8b5cf6' },
  { name: 'Bills & Utilities', icon: 'Receipt', color: '#a78bfa' },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#c084fc' },
  { name: 'Entertainment', icon: 'Gamepad2', color: '#e879f9' },
  { name: 'Health & Fitness', icon: 'Heart', color: '#f472b6' },
  { name: 'Education', icon: 'GraduationCap', color: '#fb7185' },
  { name: 'Other', icon: 'MoreHorizontal', color: '#94a3b8' },
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
