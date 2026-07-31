'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DashboardStats } from '@/components/DashboardStats';
import { SpendingCharts } from '@/components/SpendingCharts';
import { RecentTransactions } from '@/components/RecentTransactions';
import { ExpenseModal } from '@/components/ExpenseModal';
import { useAppStore } from '@/lib/store';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const openExpenseModal = useAppStore((s) => s.openExpenseModal);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Track your spending and stay on budget.
          </p>
        </div>
        <Button onClick={() => openExpenseModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </motion.div>

      <div className="space-y-6">
        <DashboardStats />
        <SpendingCharts />
        <RecentTransactions />
      </div>

      <ExpenseModal />
    </div>
  );
}
