'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useDatabase } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { motion } from 'motion/react';

const colorOptions = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
  '#a855f7', '#ec4899', '#6b7280', '#14b8a6', '#8b5cf6',
];

export default function CategoriesPage() {
  const { categories, openCategoryModal, editingCategory } = useAppStore();
  const { addCategory, updateCategory, deleteCategory } = useDatabase();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(colorOptions[0]);
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setColor(editingCategory.color);
      setBudget(editingCategory.budget?.toString() || '');
    } else {
      setName('');
      setColor(colorOptions[0]);
      setBudget('');
    }
  }, [editingCategory]);

  const handleOpenModal = (category?: any) => {
    if (category) {
      openCategoryModal(category);
    } else {
      openCategoryModal();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName('');
    setColor(colorOptions[0]);
    setBudget('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      const categoryData = {
        name,
        icon: 'Tag',
        color,
        budget: budget ? parseFloat(budget) : undefined,
      };

      if (editingCategory) {
        await updateCategory({ ...categoryData, id: editingCategory.id, createdAt: editingCategory.createdAt });
      } else {
        await addCategory(categoryData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your expense categories and budgets.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="theme-surface relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-2"
                style={{ backgroundColor: category.color }}
              />
              <CardHeader className="pt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <Tag className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {category.budget && (
                        <p className="text-sm text-muted-foreground">
                          Budget: ${category.budget.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenModal(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCategoryToDelete(category.id!)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((colorOption) => (
                    <button
                      key={colorOption}
                      type="button"
                      className={`h-8 w-8 rounded-full transition-transform ${
                        color === colorOption ? 'scale-110 ring-2 ring-offset-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: colorOption }}
                      onClick={() => setColor(colorOption)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Monthly Budget (optional)
                </label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Expenses in this category will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
