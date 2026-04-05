'use client';

import AppLayout from '@/components/AppLayout';
import { useProfile } from '@/hooks/useProfile';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import SmartRecommendations from '@/components/SmartRecommendations';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { startOfMonth, endOfMonth, isWithinInterval, subDays, subMonths, format, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { useAIInsights } from '@/hooks/useAIInsights';
import { getCurrencySymbol } from '@/lib/currency';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type Period = '7d' | '30d' | '6m';

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { budgets, loading: budgetsLoading } = useBudgets();
  const [period, setPeriod] = useState<Period>('30d');
  const router = useRouter();

  const loading = profileLoading || transactionsLoading || budgetsLoading;

  // Redirect to onboarding if user hasn't completed their financial profile
  useEffect(() => {
    if (!profileLoading && profile && !(profile as any).onboarding_completed) {
      router.replace('/onboarding');
    }
  }, [profile, profileLoading, router]);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    );

    const totalBalance = transactions.reduce((sum, t) => 
      t.type === 'income' ? sum + t.amount : sum - t.amount, 0
    );

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = monthlyIncome > 0 
      ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
      : 0;

    const symbol = getCurrencySymbol(profile?.currency || 'USD');

    return [
      { name: 'Total Balance', value: `${symbol}${totalBalance.toLocaleString()}`, change: 'Real-time', icon: Wallet, color: 'text-primary' },
      { name: 'Monthly Income', value: `${symbol}${monthlyIncome.toLocaleString()}`, change: 'This Month', icon: ArrowUpRight, color: 'text-emerald-500' },
      { name: 'Monthly Expenses', value: `${symbol}${monthlyExpenses.toLocaleString()}`, change: 'This Month', icon: ArrowDownRight, color: 'text-rose-500' },
      { name: 'Savings Rate', value: `${savingsRate}%`, change: 'This Month', icon: TrendingUp, color: 'text-blue-500' },
    ];
  }, [transactions, profile]);

  const spendingTrendData = useMemo(() => {
    const now = new Date();
    const symbol = getCurrencySymbol(profile?.currency || 'USD');

    if (period === '7d' || period === '30d') {
      const days = period === '7d' ? 6 : 29;
      const start = subDays(now, days);
      const dayRange = eachDayOfInterval({ start, end: now });

      return dayRange.map(day => {
        const label = format(day, period === '7d' ? 'EEE' : 'MMM dd');
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayExpenses = transactions
          .filter(t => t.type === 'expense' && t.date?.startsWith(dayStr))
          .reduce((sum, t) => sum + t.amount, 0);
        const dayIncome = transactions
          .filter(t => t.type === 'income' && t.date?.startsWith(dayStr))
          .reduce((sum, t) => sum + t.amount, 0);
        return { label, expenses: dayExpenses, income: dayIncome };
      });
    } else {
      // 6 months - group by month
      const months = eachMonthOfInterval({ start: subMonths(now, 5), end: now });
      return months.map(month => {
        const label = format(month, 'MMM');
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const filtered = transactions.filter(t => {
          const d = new Date(t.date);
          return d >= monthStart && d <= monthEnd;
        });
        const expenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        return { label, expenses, income };
      });
    }
  }, [transactions, period, profile]);

  const { insights: aiInsights, loading: insightsLoading } = useAIInsights();
  const symbol = getCurrencySymbol(profile?.currency || 'USD');

  // Build a short transaction summary for the AI personalization engine
  const transactionsSummary = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthly = transactions.filter(t => isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd }));
    const expenses = monthly.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const categories = expenses.reduce((acc: any, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
    const topCategory = Object.entries(categories).sort((a: any, b: any) => b[1] - a[1])[0];
    return `Monthly expenses: ${symbol}${totalExpense.toFixed(0)}. Top category: ${topCategory ? `${topCategory[0]} (${symbol}${Number(topCategory[1]).toFixed(0)})` : 'N/A'}. Total transactions: ${expenses.length}.`;
  }, [transactions, symbol]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back, {profile?.full_name?.split(' ')[0] || 'User'}</h1>
          <p className="text-zinc-500">Here's what's happening with your finances today.</p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center glass-card">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="glass-card p-6 group hover:border-primary/50 transition-all cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-zinc-800 group-hover:bg-primary/10 transition-colors`}>
                  <stat.icon className={`w-5 h-5 ${stat.color} group-hover:text-primary`} />
                </div>
                <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
              </div>
              <p className="text-sm font-medium text-zinc-500 mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Smart Advisor — Personalized Recommendations */}
        {profile && !loading && (
          <SmartRecommendations profile={profile} transactionsSummary={transactionsSummary} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spending Trends Chart */}
          <div className="lg:col-span-2 glass-card p-6 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Spending Trends</h3>
              <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                {(['7d', '30d', '6m'] as Period[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      'px-3 py-1 text-xs font-semibold rounded-md transition-all',
                      period === p ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white'
                    )}
                  >
                    {p === '7d' ? 'Last 7d' : p === '30d' ? 'Last 30d' : '6 Months'}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[280px] w-full mt-auto">
              {spendingTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      stroke="#71717a" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      interval={period === '30d' ? 4 : 0}
                    />
                    <YAxis 
                      stroke="#71717a" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(v) => `${symbol}${v}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '12px', fontSize: '12px' }}
                      labelStyle={{ color: '#a1a1aa', marginBottom: '4px', fontWeight: 600 }}
                      formatter={(value: any, name: any) => [`${symbol}${Number(value).toLocaleString()}`, name === 'expenses' ? 'Expenses' : 'Income']}
                    />
                    <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 5, fill: '#22c55e' }} />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expensesGrad)" dot={false} activeDot={{ r: 5, fill: '#ef4444' }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-zinc-500 text-xs italic">
                  No data available for this period
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 mt-4 justify-center">
              <span className="flex items-center gap-2 text-xs text-zinc-400"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Income</span>
              <span className="flex items-center gap-2 text-xs text-zinc-400"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />Expenses</span>
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-primary/20 bg-primary/5 relative overflow-hidden group min-h-[400px]">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="text-primary/20 w-12 h-12" />
              </div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="text-primary w-5 h-5" />
                AI Insights
              </h3>
              
              <div className="space-y-4">
                {insightsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : aiInsights.length > 0 ? (
                  aiInsights.map((insight, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-4 rounded-xl border transition-all hover:scale-[1.02]",
                        insight.type === 'warning' ? "bg-rose-500/10 border-rose-500/20" :
                        insight.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20" :
                        "bg-blue-500/10 border-blue-500/20"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                         <div className={cn(
                           "w-2 h-2 rounded-full",
                           insight.type === 'warning' ? "bg-rose-500" :
                           insight.type === 'success' ? "bg-emerald-500" :
                           "bg-blue-500"
                         )} />
                         <h4 className="text-sm font-bold truncate uppercase tracking-tight">{insight.title}</h4>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">{insight.description}</p>
                      {insight.suggestion && (
                        <div className="text-[10px] p-2 bg-black/40 rounded-lg border border-white/5 text-zinc-400 italic">
                          💡 {insight.suggestion}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xs text-zinc-500 italic">No insights available yet. Add more data!</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[9px] text-zinc-600 text-center leading-tight">
                  This is AI-generated financial guidance and not professional financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>

</AppLayout>
  );
}


