import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { classifyExpense } from "@/lib/classifier";
import { EXPENSE_CATEGORIES, ExpenseCategory } from "@/types";
import { Plus, Sparkles, Check } from "lucide-react";

export function QuickAddExpense() {
  const { dispatch } = useApp();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<ExpenseCategory>("Other");
  const [autoClassified, setAutoClassified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (value.trim().length > 2) {
      const detected = classifyExpense(value);
      setCategory(detected);
      setAutoClassified(true);
    } else {
      setAutoClassified(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0 || !description.trim()) return;

    dispatch({
      type: "ADD_EXPENSE",
      payload: {
        amount: parsed,
        description: description.trim(),
        category,
        date,
      },
    });

    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("Other");
    setAutoClassified(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10">
            <Plus className="h-3.5 w-3.5 text-primary" />
          </div>
          Quick Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g. Uber to airport, Netflix subscription..."
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="category">Category</Label>
              {autoClassified && (
                <Badge variant="secondary" className="gap-1 text-[10px] animate-bounce-in">
                  <Sparkles className="h-3 w-3" />
                  Auto-detected
                </Badge>
              )}
            </div>
            <Select
              value={category}
              onValueChange={(val) => {
                setCategory(val as ExpenseCategory);
                setAutoClassified(false);
              }}
            >
              <SelectTrigger id="category">
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
          <Button type="submit" className="w-full transition-all duration-200 active:scale-[0.98]" disabled={!amount || !description.trim()}>
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
          {showSuccess && (
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 animate-bounce-in">
              <Check className="h-4 w-4" />
              Expense added successfully!
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
