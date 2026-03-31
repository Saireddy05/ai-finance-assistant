'use client';

import AppLayout from '@/components/AppLayout';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { 
  PieChart as RiPieChart, 
  Cell, 
  ResponsiveContainer, 
  Pie, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { getCurrencySymbol } from '@/lib/currency';

const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { budgets, loading: budgetsLoading } = useBudgets();

  const loading = transactionsLoading || budgetsLoading;

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories: Record<string, number> = {};
    
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyTrendData = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return last6Months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const label = format(month, 'MMM');

      const monthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d >= monthStart && d <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return { label, income, expenses, savings: income - expenses };
    });
  }, [transactions]);

  const insights = useMemo(() => {
    if (monthlyTrendData.length === 0) return null;
    
    const current = monthlyTrendData[monthlyTrendData.length - 1];
    const previous = monthlyTrendData.length > 1 ? monthlyTrendData[monthlyTrendData.length - 2] : { expenses: 0, savings: 0 };
    
    const expenseChange = previous.expenses > 0 
      ? ((current.expenses - previous.expenses) / previous.expenses) * 100 
      : current.expenses > 0 ? 100 : 0;
    
    const savingsChange = previous.savings !== 0
      ? ((current.savings - previous.savings) / Math.abs(previous.savings)) * 100
      : current.savings !== 0 ? 100 : 0;

    return {
      expenseChange: expenseChange.toFixed(1),
      savingsChange: savingsChange.toFixed(1),
      isExpenseUp: current.expenses > previous.expenses,
      isSavingsUp: current.savings > previous.savings,
      hasPrevious: monthlyTrendData.length > 1
    };
  }, [monthlyTrendData]);

  const { profile } = useProfile();
  const symbol = getCurrencySymbol(profile?.currency || 'USD');

  if (loading) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-zinc-500">Visualize your financial habits and growth.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="glass-card px-4 py-2 border-primary/20 bg-primary/5">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Avg. Monthly Savings</p>
              <p className="text-lg font-bold text-primary">
                {symbol}{(monthlyTrendData.reduce((sum, d) => sum + d.savings, 0) / monthlyTrendData.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Stats Insights */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Expense Trend</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-xl font-bold">{insights?.expenseChange}%</h4>
                  <span className={insights?.isExpenseUp ? "text-rose-500" : "text-emerald-500"}>
                    {insights?.isExpenseUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-right max-w-[120px]">
                Vs previous month
              </p>
            </div>
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Savings Rate Change</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-xl font-bold">{insights?.savingsChange}%</h4>
                  <span className={insights?.isSavingsUp ? "text-emerald-500" : "text-rose-500"}>
                    {insights?.isSavingsUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-right max-w-[120px]">
                Vs previous month
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="glass-card p-6 flex flex-col h-[450px]">
            <h3 className="font-bold text-lg mb-6">Spending by Category</h3>
            <div className="h-[350px] w-full mt-auto">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RiPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </RiPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-zinc-500 text-xs italic">
                  No categorical data available
                </div>
              )}
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="glass-card p-6 flex flex-col h-[450px]">
            <h3 className="font-bold text-lg mb-6">Income vs Expenses</h3>
            <div className="h-[350px] w-full mt-auto">
              {monthlyTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="label" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      cursor={{fill: '#27272a', opacity: 0.1}}
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '12px' }}
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" />
                    <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-zinc-500 text-xs italic">
                  No comparison data available
                </div>
              )}
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="lg:col-span-2 glass-card p-6 h-[400px]">
            <h3 className="font-bold text-lg mb-6">Net Savings Trend</h3>
             <div className="h-[280px] w-full mt-auto">
               {monthlyTrendData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="label" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${symbol}${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '12px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6, stroke: '#000' }}
                        activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                      />
                    </LineChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full w-full flex items-center justify-center text-zinc-500 text-xs italic">
                  No trend data available
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
