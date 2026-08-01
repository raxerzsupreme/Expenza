'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Download, Upload, Trash2, Info, FileSpreadsheet } from 'lucide-react';
import { useDatabase } from '@/hooks/useDatabase';
import { ThemeSelector } from '@/components/ThemeSelector';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';

export default function SettingsPage() {
  const { expenses, categories } = useAppStore();
  const { addExpense, addCategory } = useDatabase();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExportCSV = () => {
    const headers = ['Date', 'Amount', 'Category', 'Note'];
    const rows = expenses.map((e) => {
      const category = categories.find((c) => c.id === e.categoryId);
      return [
        new Date(e.date).toISOString(),
        e.amount.toFixed(2),
        category?.name || 'Unknown',
        e.note || '',
      ];
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csv, 'expenza-expenses.csv', 'text/csv');
  };

  const handleExportJSON = () => {
    const data = {
      expenses,
      categories,
      exportedAt: new Date().toISOString(),
    };
    downloadFile(JSON.stringify(data, null, 2), 'expenza-data.json', 'application/json');
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Expenses sheet
    const expenseData = expenses.map((e) => {
      const category = categories.find((c) => c.id === e.categoryId);
      return {
        Date: new Date(e.date).toLocaleDateString(),
        Amount: Number(e.amount) || 0,
        Category: category?.name || 'Unknown',
        Note: e.note || '',
      };
    });
    const wsExpenses = XLSX.utils.json_to_sheet(expenseData);
    
    // Set column widths and number format for expenses
    wsExpenses['!cols'] = [
      { wch: 12 }, // Date
      { wch: 10 }, // Amount
      { wch: 15 }, // Category
      { wch: 30 }, // Note
    ];
    XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expenses');

    // Categories sheet
    const categoryData = categories.map((c) => ({
      Name: c.name,
      Color: c.color,
      Budget: Number(c.budget) || 0,
    }));
    const wsCategories = XLSX.utils.json_to_sheet(categoryData);
    
    // Set column widths for categories
    wsCategories['!cols'] = [
      { wch: 20 }, // Name
      { wch: 10 }, // Color
      { wch: 10 }, // Budget
    ];
    XLSX.utils.book_append_sheet(wb, wsCategories, 'Categories');

    // Summary sheet
    const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const totalBudget = categories.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
    const summaryData = [
      { Metric: 'Total Expenses', Value: totalExpenses },
      { Metric: 'Total Budget', Value: totalBudget },
      { Metric: 'Remaining Budget', Value: totalBudget - totalExpenses },
      { Metric: 'Number of Transactions', Value: expenses.length },
      { Metric: 'Number of Categories', Value: categories.length },
      { Metric: 'Export Date', Value: new Date().toLocaleDateString() },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [
      { wch: 25 }, // Metric
      { wch: 15 }, // Value
    ];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Generate and download
    XLSX.writeFile(wb, 'expenza-data.xlsx');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.expenses && Array.isArray(data.expenses)) {
        for (const expense of data.expenses) {
          await addExpense({
            amount: expense.amount,
            categoryId: expense.categoryId,
            date: new Date(expense.date),
            note: expense.note,
          });
        }
      }

      if (data.categories && Array.isArray(data.categories)) {
        for (const category of data.categories) {
          await addCategory({
            name: category.name,
            icon: category.icon || 'Tag',
            color: category.color || '#6b7280',
            budget: category.budget,
          });
        }
      }

      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleClearAllData = async () => {
    await db.expenses.clear();
    await db.categories.clear();
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your data and preferences.
        </p>
      </motion.div>

      <div className="grid gap-6">
        {/* App Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/expenza.png"
                  alt="Expenza Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <CardTitle>Expenza</CardTitle>
                <CardDescription>Personal Expense Tracker</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Your data is stored locally in your browser. No account required.
            </div>
          </CardContent>
        </Card>

        {/* Data Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
            <CardDescription>Your local data overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border bg-secondary/50 p-4">
                <p className="text-2xl font-bold">{expenses.length}</p>
                <p className="text-sm text-muted-foreground">Expenses</p>
              </div>
              <div className="rounded-md border bg-secondary/50 p-4">
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Choose how Expenza looks across the whole app</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>Download your expenses and categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button 
                onClick={handleExportCSV}
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button 
                onClick={handleExportJSON}
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
              <Button 
                onClick={handleExportExcel}
                variant="outline"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Import */}
        <Card>
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>Import expenses from a JSON file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <label className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted cursor-pointer">
                <Upload className="h-4 w-4" />
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
              <p className="text-sm text-muted-foreground">
                Supports Expenza JSON export format
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Clear Data Confirmation */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your expenses and categories. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAllData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
