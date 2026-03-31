'use client';

import { useTransactions } from './useTransactions';
import { useBudgets } from './useBudgets';
import { useMemo } from 'react';
import { startOfMonth, subMonths, isWithinInterval, format } from 'date-fns';

export function useAnalytics() {
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { budgets, loading: budgetsLoading } = useBudgets();

  const loading = transactionsLoading || budgetsLoading;

  const analyticsData = useMemo(() => {
    if (loading) return null;

    const now = new Date();
    const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(now, i)).reverse();

    // 1. Category Breakdown (Current Month)
    const monthStart = startOfMonth(now);
    const categoryData = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= monthStart)
      .reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const categoryBreakdown = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value: Number(value),
    })).sort((a, b) => b.value - a.value);

    // 2. Spending Trend (Last 6 Months)
    const trendData = last6Months.map(date => {
      const monthLabel = format(date, 'MMM');
      const monthStart = startOfMonth(date);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const income = transactions
        .filter(t => t.type === 'income' && isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd }))
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
        .filter(t => t.type === 'expense' && isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd }))
        .reduce((sum, t) => sum + t.amount, 0);

      return { name: monthLabel, income, expense };
    });

    // 3. Budget Variance
    const budgetVariance = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category && new Date(t.date) >= monthStart)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        category: budget.category,
        budget: budget.limit_amount,
        actual: spent,
        variance: budget.limit_amount - spent
      };
    });

    return {
      categoryBreakdown,
      trendData,
      budgetVariance
    };
  }, [transactions, budgets, loading]);

  return { data: analyticsData, loading };
}
