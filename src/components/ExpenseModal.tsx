'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useDatabase } from '@/hooks/useDatabase';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function ExpenseModal() {
  const { isExpenseModalOpen, editingExpense, closeExpenseModal, categories } = useAppStore();
  const { addExpense, updateExpense } = useDatabase();

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategoryId(editingExpense.categoryId.toString());
      setDate(new Date(editingExpense.date));
      setNote(editingExpense.note || '');
    } else {
      setAmount('');
      setCategoryId(categories[0]?.id?.toString() || '');
      setDate(new Date());
      setNote('');
    }
  }, [editingExpense, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;

    setIsSubmitting(true);
    try {
      const expenseData = {
        amount: parseFloat(amount),
        categoryId: parseInt(categoryId),
        date,
        note: note || undefined,
      };

      if (editingExpense) {
        await updateExpense({ ...expenseData, id: editingExpense.id, createdAt: editingExpense.createdAt });
      } else {
        await addExpense(expenseData);
      }
      closeExpenseModal();
    } catch (error) {
      console.error('Failed to save expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isExpenseModalOpen} onOpenChange={closeExpenseModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingExpense ? 'Edit Expense' : 'Add Expense'}
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
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="grid gap-2"
            >
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select value={categoryId} onValueChange={(v) => setCategoryId(v || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="grid gap-2"
            >
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    'inline-flex h-7 w-full items-center justify-start gap-2 rounded-lg border bg-background px-2.5 text-sm font-normal transition-colors hover:bg-muted',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => day && setDate(day)}
                  />
                </PopoverContent>
              </Popover>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="grid gap-2"
            >
              <label htmlFor="note" className="text-sm font-medium">
                Note (optional)
              </label>
              <Input
                id="note"
                placeholder="What was this expense for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </motion.div>
          </motion.div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeExpenseModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingExpense ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
