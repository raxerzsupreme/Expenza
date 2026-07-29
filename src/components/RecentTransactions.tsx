'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export function RecentTransactions() {
  const { expenses, categories } = useAppStore();

  const recentExpenses = useMemo(() => {
    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.color || '#6b7280';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link 
          href="/expenses" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {recentExpenses.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No transactions yet. Add your first expense!
          </div>
        ) : (
          <div className="space-y-4">
            {recentExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="flex items-center justify-between rounded-lg border p-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                  >
                    {getCategoryName(expense.categoryId).charAt(0)}
                  </motion.div>
                  <div>
                    <p className="font-medium">
                      {expense.note || getCategoryName(expense.categoryId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(expense.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">-${expense.amount.toFixed(2)}</p>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: getCategoryColor(expense.categoryId) + '20',
                      color: getCategoryColor(expense.categoryId),
                    }}
                  >
                    {getCategoryName(expense.categoryId)}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
