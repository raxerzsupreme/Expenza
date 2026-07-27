import { ExpenseCategory } from "@/types";

const CLASSIFICATION_RULES: Record<ExpenseCategory, string[]> = {
  Transportation: ["uber", "lyft", "gas", "taxi", "cab", "parking", "toll", "fuel", "car wash", "transit", "metro", "bus"],
  Dining: ["starbucks", "restaurant", "diner", "cafe", "coffee", "brunch", "lunch", "dinner", "breakfast", "takeout", "food delivery", "mcdonald", "chipotle", "pizza"],
  Entertainment: ["netflix", "spotify", "cinema", "movie", "concert", "ticket", "gaming", "steam", "youtube premium", "hulu", "disney+", "hbo"],
  Housing: ["rent", "mortgage", "property tax", "hoa", "home insurance", "maintenance"],
  Food: ["grocery", "market", "whole foods", "trader joe", "kroger", "safeway", "walmart grocery", "farmers market", "produce"],
  Shopping: ["amazon", "zara", "nike", "apple store", "clothing", "electronics", "furniture", "decor", "target", "mall"],
  Health: ["gym", "fitness", "doctor", "pharmacy", "cvs", "walgreens", "health insurance", "dental", "vision", "medical"],
  Education: ["course", "tuition", "book", "udemy", "coursera", "subscription", "learning", "training", "certification"],
  Utilities: ["electric", "internet", "water", "gas bill", "phone", "utility", "cable", "sewage", "trash"],
  Other: [],
};

export function classifyExpense(description: string): ExpenseCategory {
  const lower = description.toLowerCase().trim();

  for (const [category, keywords] of Object.entries(CLASSIFICATION_RULES)) {
    if (category === "Other") continue;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return category as ExpenseCategory;
      }
    }
  }

  return "Other";
}
