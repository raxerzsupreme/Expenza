import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_COLORS, ExpenseCategory } from "@/types";
import { Receipt } from "lucide-react";

export function RecentExpenses() {
  const { expenses } = useApp();

  const recent = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Receipt className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          Recent Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recent.map((expense, index) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-lg border p-3 transition-all duration-200 hover-row cursor-default animate-slide-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0 transition-all duration-300 hover:scale-[2] hover:animate-pulse-dot"
                  style={{ backgroundColor: CATEGORY_COLORS[expense.category as ExpenseCategory] }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{expense.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {expense.category} &middot;{" "}
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold tabular-nums ml-2 transition-colors duration-200">
                -{formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
