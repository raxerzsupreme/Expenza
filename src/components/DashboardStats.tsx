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
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Budget Remaining',
      value: `$${stats.budgetRemaining.toFixed(2)}`,
      icon: PiggyBank,
      description: stats.budgetRemaining >= 0 ? 'On track' : 'Over budget',
      gradient: 'from-purple-500 to-fuchsia-600',
    },
    {
      title: 'Transactions',
      value: stats.transactionCount.toString(),
      icon: Receipt,
      description: 'This month',
      gradient: 'from-fuchsia-500 to-pink-600',
    },
    {
      title: 'Avg per Transaction',
      value: `$${stats.averagePerTransaction.toFixed(2)}`,
      icon: TrendingUp,
      description: 'This month',
      gradient: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`rounded-lg bg-gradient-to-br ${card.gradient} p-2 text-white shadow-md`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="text-2xl font-bold"
              >
                {card.value}
              </motion.div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
