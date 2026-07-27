import { Expense, BudgetSettings, ExpenseCategory } from "@/types";
import { generateId } from "./utils";

function d(monthsAgo: number, day: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(day);
  return date.toISOString().split("T")[0];
}

const now = new Date();
const thisMonth = now.getMonth();
const thisYear = now.getFullYear();

function dm(monthOffset: number, day: number): string {
  const date = new Date(thisYear, thisMonth - monthOffset, day);
  return date.toISOString().split("T")[0];
}

export const SEED_EXPENSES: Expense[] = [
  { id: generateId(), amount: 45.00, description: "Uber to downtown office", category: "Transportation" as ExpenseCategory, date: dm(0, 2), createdAt: dm(0, 2), updatedAt: dm(0, 2) },
  { id: generateId(), amount: 62.50, description: "Weekly grocery run at Whole Foods", category: "Food" as ExpenseCategory, date: dm(0, 3), createdAt: dm(0, 3), updatedAt: dm(0, 3) },
  { id: generateId(), amount: 15.99, description: "Netflix subscription", category: "Entertainment" as ExpenseCategory, date: dm(0, 1), createdAt: dm(0, 1), updatedAt: dm(0, 1) },
  { id: generateId(), amount: 38.75, description: "Dinner at Italian restaurant", category: "Dining" as ExpenseCategory, date: dm(0, 5), createdAt: dm(0, 5), updatedAt: dm(0, 5) },
  { id: generateId(), amount: 1200.00, description: "Monthly rent payment", category: "Housing" as ExpenseCategory, date: dm(0, 1), createdAt: dm(0, 1), updatedAt: dm(0, 1) },
  { id: generateId(), amount: 89.99, description: "Electric utility bill", category: "Utilities" as ExpenseCategory, date: dm(0, 4), createdAt: dm(0, 4), updatedAt: dm(0, 4) },
  { id: generateId(), amount: 29.99, description: "Spotify Premium annual plan", category: "Entertainment" as ExpenseCategory, date: dm(0, 6), createdAt: dm(0, 6), updatedAt: dm(0, 6) },
  { id: generateId(), amount: 156.30, description: "New running shoes at Nike", category: "Shopping" as ExpenseCategory, date: dm(0, 7), createdAt: dm(0, 7), updatedAt: dm(0, 7) },
  { id: generateId(), amount: 35.00, description: "Lyft ride to airport", category: "Transportation" as ExpenseCategory, date: dm(0, 8), createdAt: dm(0, 8), updatedAt: dm(0, 8) },
  { id: generateId(), amount: 22.50, description: "Starbucks morning coffee and pastry", category: "Dining" as ExpenseCategory, date: dm(0, 9), createdAt: dm(0, 9), updatedAt: dm(0, 9) },
  { id: generateId(), amount: 450.00, description: "Online coding course subscription", category: "Education" as ExpenseCategory, date: dm(0, 10), createdAt: dm(0, 10), updatedAt: dm(0, 10) },
  { id: generateId(), amount: 75.00, description: "Annual doctor visit co-pay", category: "Health" as ExpenseCategory, date: dm(0, 11), createdAt: dm(0, 11), updatedAt: dm(0, 11) },
  { id: generateId(), amount: 55.00, description: "Gas station fill-up", category: "Transportation" as ExpenseCategory, date: dm(0, 12), createdAt: dm(0, 12), updatedAt: dm(0, 12) },
  { id: generateId(), amount: 42.00, description: "Lunch at Diner with friends", category: "Dining" as ExpenseCategory, date: dm(0, 14), createdAt: dm(0, 14), updatedAt: dm(0, 14) },
  { id: generateId(), amount: 18.50, description: "Farmers market vegetables", category: "Food" as ExpenseCategory, date: dm(0, 15), createdAt: dm(0, 15), updatedAt: dm(0, 15) },

  { id: generateId(), amount: 1200.00, description: "Monthly rent payment", category: "Housing" as ExpenseCategory, date: dm(1, 1), createdAt: dm(1, 1), updatedAt: dm(1, 1) },
  { id: generateId(), amount: 78.90, description: "Weekly grocery run at Trader Joes", category: "Food" as ExpenseCategory, date: dm(1, 3), createdAt: dm(1, 3), updatedAt: dm(1, 3) },
  { id: generateId(), amount: 42.30, description: "Uber to business meeting", category: "Transportation" as ExpenseCategory, date: dm(1, 5), createdAt: dm(1, 5), updatedAt: dm(1, 5) },
  { id: generateId(), amount: 65.00, description: "Dinner at Sushi restaurant", category: "Dining" as ExpenseCategory, date: dm(1, 7), createdAt: dm(1, 7), updatedAt: dm(1, 7) },
  { id: generateId(), amount: 15.99, description: "Netflix subscription", category: "Entertainment" as ExpenseCategory, date: dm(1, 1), createdAt: dm(1, 1), updatedAt: dm(1, 1) },
  { id: generateId(), amount: 95.00, description: "Internet utility bill", category: "Utilities" as ExpenseCategory, date: dm(1, 4), createdAt: dm(1, 4), updatedAt: dm(1, 4) },
  { id: generateId(), amount: 230.00, description: "Winter jacket from Zara", category: "Shopping" as ExpenseCategory, date: dm(1, 10), createdAt: dm(1, 10), updatedAt: dm(1, 10) },
  { id: generateId(), amount: 29.99, description: "Spotify Premium subscription", category: "Entertainment" as ExpenseCategory, date: dm(1, 1), createdAt: dm(1, 1), updatedAt: dm(1, 1) },
  { id: generateId(), amount: 35.00, description: "Gas station fill-up", category: "Transportation" as ExpenseCategory, date: dm(1, 12), createdAt: dm(1, 12), updatedAt: dm(1, 12) },
  { id: generateId(), amount: 28.00, description: "Coffee and bagels at cafe", category: "Dining" as ExpenseCategory, date: dm(1, 14), createdAt: dm(1, 14), updatedAt: dm(1, 14) },
  { id: generateId(), amount: 120.00, description: "Monthly gym membership", category: "Health" as ExpenseCategory, date: dm(1, 1), createdAt: dm(1, 1), updatedAt: dm(1, 1) },
  { id: generateId(), amount: 55.00, description: "Grocery restock at Kroger", category: "Food" as ExpenseCategory, date: dm(1, 18), createdAt: dm(1, 18), updatedAt: dm(1, 18) },

  { id: generateId(), amount: 1200.00, description: "Monthly rent payment", category: "Housing" as ExpenseCategory, date: dm(2, 1), createdAt: dm(2, 1), updatedAt: dm(2, 1) },
  { id: generateId(), amount: 85.00, description: "Weekly grocery haul", category: "Food" as ExpenseCategory, date: dm(2, 4), createdAt: dm(2, 4), updatedAt: dm(2, 4) },
  { id: generateId(), amount: 52.00, description: "Uber rides this week", category: "Transportation" as ExpenseCategory, date: dm(2, 7), createdAt: dm(2, 7), updatedAt: dm(2, 7) },
  { id: generateId(), amount: 78.50, description: "Birthday dinner at steakhouse", category: "Dining" as ExpenseCategory, date: dm(2, 10), createdAt: dm(2, 10), updatedAt: dm(2, 10) },
  { id: generateId(), amount: 15.99, description: "Netflix subscription", category: "Entertainment" as ExpenseCategory, date: dm(2, 1), createdAt: dm(2, 1), updatedAt: dm(2, 1) },
  { id: generateId(), amount: 89.99, description: "Electric utility bill", category: "Utilities" as ExpenseCategory, date: dm(2, 5), createdAt: dm(2, 5), updatedAt: dm(2, 5) },
  { id: generateId(), amount: 340.00, description: "Holiday gift shopping", category: "Shopping" as ExpenseCategory, date: dm(2, 15), createdAt: dm(2, 15), updatedAt: dm(2, 15) },
  { id: generateId(), amount: 120.00, description: "Monthly gym membership", category: "Health" as ExpenseCategory, date: dm(2, 1), createdAt: dm(2, 1), updatedAt: dm(2, 1) },
  { id: generateId(), amount: 45.00, description: "Gas and car wash", category: "Transportation" as ExpenseCategory, date: dm(2, 20), createdAt: dm(2, 20), updatedAt: dm(2, 20) },
  { id: generateId(), amount: 199.00, description: "Online design course", category: "Education" as ExpenseCategory, date: dm(2, 8), createdAt: dm(2, 8), updatedAt: dm(2, 8) },

  { id: generateId(), amount: 1200.00, description: "Monthly rent payment", category: "Housing" as ExpenseCategory, date: dm(3, 1), createdAt: dm(3, 1), updatedAt: dm(3, 1) },
  { id: generateId(), amount: 72.40, description: "Weekly grocery shopping", category: "Food" as ExpenseCategory, date: dm(3, 3), createdAt: dm(3, 3), updatedAt: dm(3, 3) },
  { id: generateId(), amount: 38.00, description: "Lyft to concert venue", category: "Transportation" as ExpenseCategory, date: dm(3, 6), createdAt: dm(3, 6), updatedAt: dm(3, 6) },
  { id: generateId(), amount: 55.00, description: "Concert tickets", category: "Entertainment" as ExpenseCategory, date: dm(3, 6), createdAt: dm(3, 6), updatedAt: dm(3, 6) },
  { id: generateId(), amount: 48.00, description: "Brunch at diner", category: "Dining" as ExpenseCategory, date: dm(3, 8), createdAt: dm(3, 8), updatedAt: dm(3, 8) },
  { id: generateId(), amount: 95.00, description: "Internet utility bill", category: "Utilities" as ExpenseCategory, date: dm(3, 4), createdAt: dm(3, 4), updatedAt: dm(3, 4) },
  { id: generateId(), amount: 89.99, description: "Electric utility bill", category: "Utilities" as ExpenseCategory, date: dm(3, 4), createdAt: dm(3, 4), updatedAt: dm(3, 4) },
  { id: generateId(), amount: 180.00, description: "New headphones from Amazon", category: "Shopping" as ExpenseCategory, date: dm(3, 12), createdAt: dm(3, 12), updatedAt: dm(3, 12) },
  { id: generateId(), amount: 120.00, description: "Monthly gym membership", category: "Health" as ExpenseCategory, date: dm(3, 1), createdAt: dm(3, 1), updatedAt: dm(3, 1) },

  { id: generateId(), amount: 1200.00, description: "Monthly rent payment", category: "Housing" as ExpenseCategory, date: dm(4, 1), createdAt: dm(4, 1), updatedAt: dm(4, 1) },
  { id: generateId(), amount: 68.00, description: "Grocery store run", category: "Food" as ExpenseCategory, date: dm(4, 5), createdAt: dm(4, 5), updatedAt: dm(4, 5) },
  { id: generateId(), amount: 40.00, description: "Gas fill-up", category: "Transportation" as ExpenseCategory, date: dm(4, 8), createdAt: dm(4, 8), updatedAt: dm(4, 8) },
  { id: generateId(), amount: 32.00, description: "Pizza delivery", category: "Dining" as ExpenseCategory, date: dm(4, 10), createdAt: dm(4, 10), updatedAt: dm(4, 10) },
  { id: generateId(), amount: 15.99, description: "Netflix subscription", category: "Entertainment" as ExpenseCategory, date: dm(4, 1), createdAt: dm(4, 1), updatedAt: dm(4, 1) },
  { id: generateId(), amount: 29.99, description: "Spotify Premium subscription", category: "Entertainment" as ExpenseCategory, date: dm(4, 1), createdAt: dm(4, 1), updatedAt: dm(4, 1) },
  { id: generateId(), amount: 89.99, description: "Electric utility bill", category: "Utilities" as ExpenseCategory, date: dm(4, 4), createdAt: dm(4, 4), updatedAt: dm(4, 4) },
  { id: generateId(), amount: 120.00, description: "Monthly gym membership", category: "Health" as ExpenseCategory, date: dm(4, 1), createdAt: dm(4, 1), updatedAt: dm(4, 1) },
  { id: generateId(), amount: 95.00, description: "Internet utility bill", category: "Utilities" as ExpenseCategory, date: dm(4, 4), createdAt: dm(4, 4), updatedAt: dm(4, 4) },
  { id: generateId(), amount: 275.00, description: "Electronics shopping spree", category: "Shopping" as ExpenseCategory, date: dm(4, 15), createdAt: dm(4, 15), updatedAt: dm(4, 15) },
];

export const SEED_BUDGET: BudgetSettings = {
  monthlyBudget: 3000,
  yearlyBudget: 36000,
};
