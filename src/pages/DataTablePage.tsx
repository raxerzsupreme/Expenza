import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_COLORS, EXPENSE_CATEGORIES, ExpenseCategory } from "@/types";
import { Search, Download, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Pencil } from "lucide-react";
import * as XLSX from "xlsx";

type SortField = "date" | "amount" | "description" | "category";
type SortDir = "asc" | "desc";

export default function DataTablePage() {
  const { expenses, dispatch } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<ExpenseCategory>("Other");

  const filtered = useMemo(() => {
    let result = [...expenses];

    if (categoryFilter !== "All") {
      result = result.filter((e) => e.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.amount.toString().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          cmp = a.amount - b.amount;
          break;
        case "description":
          cmp = a.description.localeCompare(b.description);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [expenses, search, categoryFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch({ type: "DELETE_EXPENSE", payload: deleteId });
      setDeleteId(null);
    }
  };

  const handleEdit = (id: string) => {
    const item = expenses.find((e) => e.id === id);
    if (item) {
      setEditItem(id);
      setEditAmount(item.amount.toString());
      setEditDescription(item.description);
      setEditCategory(item.category);
    }
  };

  const handleEditSave = () => {
    if (editItem && editAmount && editDescription.trim()) {
      dispatch({
        type: "UPDATE_EXPENSE",
        payload: {
          id: editItem,
          updates: {
            amount: parseFloat(editAmount),
            description: editDescription.trim(),
            category: editCategory,
          },
        },
      });
      setEditItem(null);
    }
  };

  const handleExport = () => {
    const data = filtered.map((e) => ({
      Date: formatDate(e.date),
      Description: e.description,
      Category: e.category,
      Amount: e.amount,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");

    ws["!cols"] = [{ wch: 12 }, { wch: 35 }, { wch: 18 }, { wch: 12 }];

    XLSX.writeFile(wb, `expenza-export-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data</h1>
          <p className="text-muted-foreground">
            {filtered.length} expenses &middot; {formatCurrency(totalAmount)} total
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 transition-all duration-200 hover:shadow-md active:scale-[0.97]">
          <Download className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          Export to Excel
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {[
                    { field: "date" as SortField, label: "Date" },
                    { field: "description" as SortField, label: "Description" },
                    { field: "category" as SortField, label: "Category" },
                    { field: "amount" as SortField, label: "Amount" },
                  ].map(({ field, label }) => (
                    <th
                      key={field}
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                      onClick={() => toggleSort(field)}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        <SortIcon field={field} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  filtered.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b last:border-0 hover-row cursor-default group/row"
                    >
                      <td className="px-4 py-3 text-sm tabular-nums whitespace-nowrap">{formatDate(expense.date)}</td>
                      <td className="px-4 py-3 text-sm font-medium max-w-[300px] truncate">{expense.description}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="gap-1.5">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[expense.category as ExpenseCategory] }}
                          />
                          {expense.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold tabular-nums">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-50 group-hover/row:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover-scale"
                            onClick={() => handleEdit(expense.id)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover-scale"
                            onClick={() => setDeleteId(expense.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update the expense details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={editCategory} onValueChange={(val) => setEditCategory(val as ExpenseCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
