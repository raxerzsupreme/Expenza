'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DashboardStats } from '@/components/DashboardStats';
import { SpendingCharts } from '@/components/SpendingCharts';
import { RecentTransactions } from '@/components/RecentTransactions';
import { ExpenseModal } from '@/components/ExpenseModal';
import { useAppStore } from '@/lib/store';

export default function DashboardPage() {
  const openExpenseModal = useAppStore((s) => s.openExpenseModal);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your spending and stay on budget.
          </p>
        </div>
        <Button onClick={() => openExpenseModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <div className="space-y-6">
        <DashboardStats />
        <SpendingCharts />
        <RecentTransactions />
      </div>

      <ExpenseModal />
    </div>
  );
}
