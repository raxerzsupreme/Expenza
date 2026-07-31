'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { format, startOfMonth, endOfMonth, subDays, isWithinInterval, eachDayOfInterval } from 'date-fns';
import { motion } from 'motion/react';

export function SpendingCharts() {
  const { expenses, categories } = useAppStore();

  const categoryData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const thisMonthExpenses = expenses.filter((e) => {
      const date = new Date(e.date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    const spendingByCategory: { [key: number]: number } = {};
    thisMonthExpenses.forEach((expense) => {
      spendingByCategory[expense.categoryId] = 
        (spendingByCategory[expense.categoryId] || 0) + expense.amount;
    });

    return categories
      .map((cat) => ({
        name: cat.name,
        value: spendingByCategory[cat.id!] || 0,
        color: cat.color,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses, categories]);

  const dailyData = useMemo(() => {
    const now = new Date();
    const last30Days = subDays(now, 29);
    const days = eachDayOfInterval({ start: last30Days, end: now });

    return days.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayExpenses = expenses.filter((e) => {
        const date = format(new Date(e.date), 'yyyy-MM-dd');
        return date === dayStr;
      });
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        date: format(day, 'MMM d'),
        amount: total,
      };
    });
  }, [expenses]);

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No expenses this month
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-4 grid grid-cols-2 gap-2"
                >
                  {categoryData.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="flex-1">{item.name}</span>
                      <span className="font-medium">
                        ${item.value.toFixed(2)}
                        <span className="text-muted-foreground ml-1">
                          ({((item.value / totalSpent) * 100).toFixed(0)}%)
                        </span>
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Spending Trend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Daily Spending (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dailyData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
