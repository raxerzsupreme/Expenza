'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import {
  saveBudget,
  getBudgetForPeriod,
  generatePeriodOptions,
  type Budget,
  type CategoryLimit,
} from '@/lib/budget';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'motion/react';
import { Plus, Trash2, Target } from 'lucide-react';

interface BudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetSaved?: () => void;
}

export function BudgetModal({ open, onOpenChange, onBudgetSaved }: BudgetModalProps) {
  const { categories } = useAppStore();
  const periodOptions = generatePeriodOptions();

  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0] || '');
  const [totalAmount, setTotalAmount] = useState('');
  const [categoryLimits, setCategoryLimits] = useState<CategoryLimit[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && selectedPeriod) {
      const existing = getBudgetForPeriod(selectedPeriod);
      if (existing) {
        setTotalAmount(existing.totalAmount.toString());
        setCategoryLimits(existing.categoryLimits);
      } else {
        setTotalAmount('');
        setCategoryLimits([]);
      }
    }
  }, [open, selectedPeriod]);

  const handleAddCategoryLimit = () => {
    setCategoryLimits([...categoryLimits, { categoryId: categories[0]?.id || 0, limit: 0 }]);
  };

  const handleRemoveCategoryLimit = (index: number) => {
    setCategoryLimits(categoryLimits.filter((_, i) => i !== index));
  };

  const handleCategoryLimitChange = (index: number, field: 'categoryId' | 'limit', value: string | number) => {
    const updated = [...categoryLimits];
    if (field === 'categoryId') {
      updated[index] = { ...updated[index], categoryId: Number(value) };
    } else {
      updated[index] = { ...updated[index], limit: Number(value) || 0 };
    }
    setCategoryLimits(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeriod || !totalAmount) return;

    setIsSubmitting(true);
    try {
      const budget: Budget = {
        id: `budget_${Date.now()}`,
        period: selectedPeriod,
        totalAmount: Number(totalAmount),
        categoryLimits: categoryLimits.filter((cl) => cl.limit > 0),
        createdAt: new Date().toISOString(),
      };

      saveBudget(budget);
      onBudgetSaved?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-teal-600" />
            Set Budget
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 py-4"
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="grid gap-2"
            >
              <label className="text-sm font-medium">Budget Period</label>
              <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="grid gap-2"
            >
              <label className="text-sm font-medium">Total Budget Amount</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="grid gap-2"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Category Limits (Optional)</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddCategoryLimit}
                  className="h-7 text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Limit
                </Button>
              </div>

              {categoryLimits.length > 0 && (
                <div className="grid gap-2">
                  {categoryLimits.map((cl, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select
                        value={cl.categoryId.toString()}
                        onValueChange={(v) => handleCategoryLimitChange(index, 'categoryId', v || '0')}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id!.toString()}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Limit"
                        value={cl.limit || ''}
                        onChange={(e) => handleCategoryLimitChange(index, 'limit', e.target.value)}
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCategoryLimit(index)}
                        className="h-8 w-8 shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
