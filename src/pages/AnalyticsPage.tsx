import React, { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { CATEGORY_COLORS, ExpenseCategory } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

const CHART_COLORS = [
  "#2563eb", "#f59e0b", "#8b5cf6", "#ef4444", "#10b981",
  "#ec4899", "#06b6d4", "#6366f1", "#84cc16", "#6b7280",
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-white px-4 py-3 shadow-xl dark:bg-zinc-900 transition-all duration-200">
      {label && (
        <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
      )}
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          <span className="text-sm font-semibold tabular-nums">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="rounded-xl border bg-white px-4 py-3 shadow-xl dark:bg-zinc-900">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: data.payload?.fill || data.color }}
        />
        <span className="text-sm font-medium">{data.name}</span>
      </div>
      <span className="text-lg font-bold tabular-nums">{formatCurrency(data.value)}</span>
    </div>
  );
}

function CategoryPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="white" textAnchor="middle" dominantBaseline="central"
      className="text-xs font-semibold drop-shadow-sm"
      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function AnalyticsPage() {
  const { expenses, dateFilter, customDateRange, dispatch } = useApp();
  const [filterType, setFilterType] = useState(dateFilter);

  const handleFilterChange = (val: string) => {
    setFilterType(val as any);
    dispatch({ type: "SET_DATE_FILTER", payload: val as any });
  };

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let filtered = [...expenses];
    switch (filterType) {
      case "this-month": {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        filtered = filtered.filter((e) => { const d = new Date(e.date); return d >= start && d <= end; });
        break;
      }
      case "last-month": {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        filtered = filtered.filter((e) => { const d = new Date(e.date); return d >= start && d <= end; });
        break;
      }
      case "year-to-date": {
        const start = new Date(now.getFullYear(), 0, 1);
        filtered = filtered.filter((e) => new Date(e.date) >= start);
        break;
      }
      case "custom": {
        const from = new Date(customDateRange.from);
        const to = new Date(customDateRange.to);
        filtered = filtered.filter((e) => { const d = new Date(e.date); return d >= from && d <= to; });
        break;
      }
    }
    return filtered;
  }, [expenses, filterType, customDateRange]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value], i) => ({
        name,
        value: parseFloat(value.toFixed(2)),
        fill: CATEGORY_COLORS[name as ExpenseCategory] || CHART_COLORS[i % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + e.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => {
        const [y, m] = month.split("-");
        const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        return { month: label, total: parseFloat(total.toFixed(2)) };
      });
  }, [filteredExpenses]);

  const dailyData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      const d = new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map[d] = (map[d] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([date, total]) => ({ date, total: parseFloat(total.toFixed(2)) }));
  }, [filteredExpenses]);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense = filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0;

  const emptyState = (
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
      <PieChartIcon className="h-10 w-10 opacity-30" />
      <p className="text-sm">No data for selected period</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize your spending patterns.{" "}
            <span className="text-foreground font-medium">{formatCurrency(totalSpent)}</span> across{" "}
            <span className="text-foreground font-medium">{filteredExpenses.length}</span> expenses
            {filteredExpenses.length > 0 && (
              <> &middot; <span className="text-foreground font-medium">{formatCurrency(avgExpense)}</span> avg</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="year-to-date">Year-to-Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {filterType === "custom" && (
            <div className="flex items-center gap-2 animate-slide-up">
              <Input
                type="date"
                value={customDateRange.from}
                onChange={(e) =>
                  dispatch({ type: "SET_CUSTOM_DATE_RANGE", payload: { ...customDateRange, from: e.target.value } })
                }
                className="w-36"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={customDateRange.to}
                onChange={(e) =>
                  dispatch({ type: "SET_CUSTOM_DATE_RANGE", payload: { ...customDateRange, to: e.target.value } })
                }
                className="w-36"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex items-center justify-center h-6 w-6 rounded-md bg-violet-500/10">
                <PieChartIcon className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? emptyState : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                      label={CategoryPieLabel}
                      labelLine={false}
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={entry.fill}
                          className="transition-all duration-200 cursor-pointer hover:opacity-80 hover:drop-shadow-md"
                          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 justify-center">
                  {categoryData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs hover-scale cursor-default">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: entry.fill }}
                      />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex items-center justify-center h-6 w-6 rounded-md bg-blue-500/10">
                <BarChart3 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? emptyState : (
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={monthlyData} barCategoryGap="20%">
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-50" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                  />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 6, opacity: 0.5 }} />
                  <Bar
                    dataKey="total"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                    animationDuration={800}
                    animationEasing="ease-out"
                    className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Line / Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex items-center justify-center h-6 w-6 rounded-md bg-emerald-500/10">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            Daily Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyData.length === 0 ? emptyState : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-50" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.5 }} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#areaGradient)"
                  dot={{ fill: "#10b981", strokeWidth: 0, r: 3.5, className: "transition-all duration-200 hover:r-5 cursor-pointer" }}
                  activeDot={{ r: 6, fill: "#10b981", stroke: "white", strokeWidth: 2, className: "cursor-pointer drop-shadow-md" }}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
