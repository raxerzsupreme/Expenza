'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Receipt, PiggyBank, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { motion } from 'motion/react';

export function DashboardStats() {
  const { expenses, categories } = useAppStore();

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

  const cards = [
    {
      title: 'Total This Month',
      value: `$${stats.totalThisMonth.toFixed(2)}`,
      icon: DollarSign,
      description: format(new Date(), 'MMMM yyyy'),
    },
    {
      title: 'Budget Remaining',
      value: `$${stats.budgetRemaining.toFixed(2)}`,
      icon: PiggyBank,
      description: stats.budgetRemaining >= 0 ? 'On track' : 'Over budget',
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
  );
}
