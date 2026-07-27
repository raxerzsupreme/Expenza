import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BudgetCard } from "@/components/BudgetCard";
import { QuickAddExpense } from "@/components/QuickAddExpense";
import { RecentExpenses } from "@/components/RecentExpenses";
import { useApp } from "@/context/AppContext";
import { Wallet, TrendingUp, PiggyBank } from "lucide-react";

export default function DashboardPage() {
  const { budget, totalSpentThisMonth, totalSpentThisYear, remainingMonthly, remainingYearly, monthlyPercentage, yearlyPercentage } = useApp();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="animate-slide-up">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your spending at a glance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <BudgetCard
              title="Monthly Budget"
              total={budget.monthlyBudget}
              spent={totalSpentThisMonth}
              remaining={remainingMonthly}
              percentage={monthlyPercentage}
              icon={<Wallet className="h-4 w-4" />}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <BudgetCard
              title="Yearly Budget"
              total={budget.yearlyBudget}
              spent={totalSpentThisYear}
              remaining={remainingYearly}
              percentage={yearlyPercentage}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <BudgetCard
              title="Monthly Savings Goal"
              total={budget.monthlyBudget * 0.2}
              spent={budget.monthlyBudget * 0.2 - Math.max(0, remainingMonthly - budget.monthlyBudget * 0.8)}
              remaining={Math.max(0, remainingMonthly - budget.monthlyBudget * 0.8)}
              percentage={Math.min(((budget.monthlyBudget * 0.2 - Math.max(0, remainingMonthly - budget.monthlyBudget * 0.8)) / (budget.monthlyBudget * 0.2)) * 100, 100)}
              icon={<PiggyBank className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <QuickAddExpense />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "250ms" }}>
            <RecentExpenses />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
