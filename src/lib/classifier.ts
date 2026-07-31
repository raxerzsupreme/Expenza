import type { Category } from '@/types';

const categoryKeywords: Record<string, string[]> = {
  'Food & Dining': [
    'restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast', 'food',
    'meal', 'snack', 'pizza', 'burger', 'sushi', 'takeout', 'delivery',
    'uber eats', 'doordash', 'grubhub', 'mcdonalds', 'starbucks', 'subway',
    'grocery', 'groceries', 'supermarket', 'walmart', 'target', 'costco',
  ],
  'Transport': [
    'gas', 'fuel', 'uber', 'lyft', 'taxi', 'bus', 'train', 'metro',
    'parking', 'toll', 'car wash', 'oil change', 'tire', 'mechanic',
    'public transport', 'commute', 'flight', 'airline', 'ticket',
  ],
  'Bills & Utilities': [
    'electric', 'electricity', 'water', 'gas bill', 'internet', 'wifi',
    'phone', 'mobile', 'cell', 'cable', 'tv', 'streaming', 'netflix',
    'spotify', 'hulu', 'disney', 'amazon prime', 'rent', 'mortgage',
    'insurance', 'utility', 'utilities', 'bill',
  ],
  'Shopping': [
    'amazon', 'ebay', 'clothes', 'clothing', 'shoes', 'electronics',
    'gadget', 'phone case', 'headphones', 'laptop', 'computer', 'furniture',
    'home depot', 'ikea', 'target', 'walmart', 'mall', 'store', 'shop',
    'gift', 'present',
  ],
  'Entertainment': [
    'movie', 'cinema', 'theater', 'concert', 'game', 'gaming', 'steam',
    'playstation', 'xbox', 'nintendo', 'bar', 'club', 'party', 'event',
    'ticket', 'bowling', 'arcade', 'hobby', 'fun',
  ],
  'Health & Fitness': [
    'gym', 'fitness', 'workout', 'exercise', 'yoga', 'pharmacy', 'medicine',
    'doctor', 'hospital', 'clinic', 'dental', 'dentist', 'health',
    'medical', 'prescription', 'vitamin', 'supplement', 'protein',
  ],
  'Education': [
    'course', 'class', 'tuition', 'book', 'textbook', 'school', 'college',
    'university', 'learning', 'udemy', 'coursera', 'skillshare', 'education',
    'training', 'workshop', 'seminar',
  ],
};

export function classifyExpense(
  note: string | undefined,
  categories: Category[]
): number | null {
  if (!note || note.trim().length === 0) return null;

  const normalizedNote = note.toLowerCase().trim();

  for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!matchedCategory) continue;

    for (const keyword of keywords) {
      if (normalizedNote.includes(keyword.toLowerCase())) {
        return matchedCategory.id!;
      }
    }
  }

  return null;
}

export function suggestCategory(
  note: string | undefined,
  categories: Category[]
): Category | null {
  const categoryId = classifyExpense(note, categories);
  if (categoryId === null) return null;
  return categories.find((c) => c.id === categoryId) || null;
}
