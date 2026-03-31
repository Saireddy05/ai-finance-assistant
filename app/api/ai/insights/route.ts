import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { getCurrencySymbol } from '@/lib/currency';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch Transactions & Profile
    const [transactionsRes, profileRes] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', user.id),
      supabase.from('profiles').select('currency').eq('id', user.id).single()
    ]);

    const transactions = (transactionsRes.data as any[]) || [];
    const userCurrency = (profileRes.data as any)?.currency || 'USD';
    const symbol = getCurrencySymbol(userCurrency);

    // 2. Data Analysis (JS Logic)
    const now = new Date();
    const currentStart = startOfMonth(now);
    const previousStart = startOfMonth(subMonths(now, 1));
    const previousEnd = endOfMonth(subMonths(now, 1));

    const currentMonthTx = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: currentStart, end: now })
    );

    const previousMonthTx = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: previousStart, end: previousEnd })
    );

    const calcTotals = (txs: any[]) => {
      const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      const categories = txs.filter(t => t.type === 'expense').reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);
      return { income, expenses, categories };
    };

    const current = calcTotals(currentMonthTx);
    const previous = calcTotals(previousMonthTx);

    const savings = current.income - current.expenses;
    const savingsRate = current.income > 0 ? (savings / current.income) * 100 : 0;

    // 3. Pattern Detection (Insight Signals)
    const signals: string[] = [];

    // Pattern 1: Overspending
    if (current.expenses > current.income && current.income > 0) {
      signals.push(`Overspending detected: Expenses (${symbol}${current.expenses}) exceeded Income (${symbol}${current.income}).`);
    }

    // Pattern 2: Low Savings
    if (savingsRate < 20 && current.income > 0) {
      signals.push(`Low savings rate: You're saving ${savingsRate.toFixed(1)}% of your income, which is below the 20% target.`);
    }

    // Pattern 3: Category Spikes
    Object.keys(current.categories).forEach(cat => {
      const currAmt = (current.categories as any)[cat];
      const prevAmt = (previous.categories as any)[cat] || 0;
      if (prevAmt > 0) {
        const increase = ((currAmt - prevAmt) / prevAmt) * 100;
        if (increase > 20) {
          signals.push(`Spending spike in "${cat}": Increased by ${increase.toFixed(0)}% compared to last month.`);
        }
      }
    });

    // Pattern 4: Top Spending Category
    const topCat = Object.entries(current.categories as Record<string, number>).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
      signals.push(`Top spending category: ${topCat[0]} (${symbol}${topCat[1].toLocaleString()}).`);
    }

    if (signals.length === 0) {
      signals.push("No major spending anomalies detected. Keep up the good work!");
    }

    // 4. AI Interpretation
    const { generateDataDrivenInsights } = await import('@/lib/ai');
    const summary = `
      Income: ${symbol}${current.income}
      Expenses: ${symbol}${current.expenses}
      Savings Rate: ${savingsRate.toFixed(1)}%
      Top Category: ${topCat ? topCat[0] : 'N/A'}
    `;

    const aiInsights = await generateDataDrivenInsights(summary, signals);

    return NextResponse.json(aiInsights);
  } catch (error: any) {
    console.error('Insights Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
