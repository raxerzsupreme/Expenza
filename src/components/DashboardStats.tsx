'use client';

import { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Receipt, PiggyBank, TrendingUp, AlertTriangle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import {
  getBudgetForPeriod,
  getCurrentPeriod,
  computeBudgetProgress,
  type Budget,
} from '@/lib/budget';

export function DashboardStats() {
  const { expenses, categories } = useAppStore();
  const [budget, setBudget] = useState<Budget | undefined>(undefined);
  const [budgetKey, setBudgetKey] = useState(0);

  useEffect(() => {
    const period = getCurrentPeriod();
    setBudget(getBudgetForPeriod(period));
  }, [budgetKey]);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const thisMonthExpenses = expenses.filter((e) => {
      const date = new Date(e.date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const totalBudget = categories.reduce((sum, c) => sum + (c.budget || 0), 0);
    const budgetRemaining = totalBudget - totalThisMonth;

    return {
      totalThisMonth,
      budgetRemaining,
      transactionCount: thisMonthExpenses.length,
      averagePerTransaction: thisMonthExpenses.length > 0 
        ? totalThisMonth / thisMonthExpenses.length 
        : 0,
    };
  }, [expenses, categories]);

  const budgetProgress = useMemo(() => {
    return computeBudgetProgress(stats.totalThisMonth, budget);
  }, [stats.totalThisMonth, budget]);

  const isOverBudget = budget && budget.totalAmount > 0 && stats.totalThisMonth > budget.totalAmount;

  const cards = [
    {
      title: 'Total This Month',
      value: `$${stats.totalThisMonth.toFixed(2)}`,
      icon: DollarSign,
      description: format(new Date(), 'MMMM yyyy'),
    },
    {
      title: 'Budget Remaining',
      value: budget 
        ? `$${(budget.totalAmount - stats.totalThisMonth).toFixed(2)}`
        : `$${stats.budgetRemaining.toFixed(2)}`,
      icon: PiggyBank,
      description: budget ? budgetProgress.status : 'No budget set',
    },
    {
      title: 'Transactions',
      value: stats.transactionCount.toString(),
      icon: Receipt,
      description: 'This month',
    },
    {
      title: 'Avg per Transaction',
      value: `$${stats.averagePerTransaction.toFixed(2)}`,
      icon: TrendingUp,
      description: 'This month',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Over Budget Alert */}
      <AnimatePresence>
        {isOverBudget && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30">
              <CardContent className="flex items-center gap-3 py-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <div>
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                    Budget Exceeded
                  </p>
                  <p className="text-xs text-rose-600 dark:text-rose-400">
                    You've spent ${stats.totalThisMonth.toFixed(2)} of your ${budget!.totalAmount.toFixed(2)} budget 
                    for {budget!.period}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Progress Bar */}
      {budget && budget.totalAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Budget Progress — {budget.period}
                </span>
                <span className="text-sm font-semibold">
                  ${stats.totalThisMonth.toFixed(2)} / ${budget.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${budgetProgress.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetProgress.percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {budgetProgress.percentage.toFixed(1)}% used — {budgetProgress.status}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
