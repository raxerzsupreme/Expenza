import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BudgetCardProps {
  title: string;
  total: number;
  spent: number;
  remaining: number;
  percentage: number;
  icon: React.ReactNode;
}

export function BudgetCard({ title, total, spent, remaining, percentage, icon }: BudgetCardProps) {
  const isWarning = percentage >= 80 && percentage < 100;
  const isDanger = percentage >= 100;

  return (
    <Card className="relative overflow-hidden hover-glow group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl font-bold tracking-tight transition-colors duration-200">
          {formatCurrency(spent)}
        </div>
        <p className="text-xs text-muted-foreground">
          of {formatCurrency(total)} budget
        </p>
        <Progress
          value={percentage}
          className="h-2.5"
          indicatorClassName={cn(
            "transition-all duration-700 ease-out",
            isDanger && "bg-destructive",
            isWarning && "bg-warning",
            !isWarning && !isDanger && "bg-primary"
          )}
        />
        <div className="flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isDanger && "text-destructive",
                  isWarning && "text-warning",
                  !isWarning && !isDanger && "text-muted-foreground"
                )}
              >
                {percentage.toFixed(1)}% used
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{formatCurrency(total - spent)} remaining</p>
            </TooltipContent>
          </Tooltip>
          <span
            className={cn(
              "text-xs font-medium transition-colors duration-200",
              remaining >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
            )}
          >
            {remaining >= 0 ? formatCurrency(remaining) : `-${formatCurrency(Math.abs(remaining))}`} left
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
