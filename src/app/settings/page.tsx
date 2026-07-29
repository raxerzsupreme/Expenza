'use client';

import { useState } from 'react';
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
import { Download, Upload, Trash2, Wallet, Info, FileSpreadsheet } from 'lucide-react';
import { useDatabase } from '@/hooks/useDatabase';
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
        Amount: e.amount,
        Category: category?.name || 'Unknown',
        Note: e.note || '',
      };
    });
    const wsExpenses = XLSX.utils.json_to_sheet(expenseData);
    
    // Set column widths for expenses
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
      Budget: c.budget || 0,
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
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = categories.reduce((sum, c) => sum + (c.budget || 0), 0);
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your data and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* App Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 p-2">
                <Wallet className="h-5 w-5 text-white" />
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
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/30">
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{expenses.length}</p>
                <p className="text-sm text-muted-foreground">Expenses</p>
              </div>
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
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
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-purple-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button 
                onClick={handleExportJSON}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-purple-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
              <Button 
                onClick={handleExportExcel}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-purple-700"
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
              <label className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 cursor-pointer dark:border-purple-800 dark:bg-purple-950/30 dark:text-purple-300 dark:hover:bg-purple-900/50">
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
