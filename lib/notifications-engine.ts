import { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Budget = Database['public']['Tables']['budgets']['Row'];
type SavingsGoal = Database['public']['Tables']['savings_goals']['Row'];

export interface FinancialSignal {
  type: 'spike' | 'habit' | 'budget_exhaustion' | 'savings_milestone' | 'info';
  category?: string;
  data: any;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Core analysis engine to detect financial 'signals' from user data.
 * Detects spikes, habits, overspending, and savings milestones.
 */
export function analyzeFinancialSignals(
  transactions: Transaction[],
  budgets: Budget[],
  goals: SavingsGoal[] = []
): FinancialSignal[] {
  const signals: FinancialSignal[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // --- 1. Unusual Spending Spikes ---
  // Detects if today's spending is significantly higher than the 7-day average.
  const todayExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date) >= today)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const pastSevenDaysExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date) >= sevenDaysAgo && new Date(t.date) < today)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const avgDailySpend = pastSevenDaysExpenses / 7;

  // Threshold: 2x average and at least $50 to avoid noise
  if (todayExpenses > (avgDailySpend * 2) && todayExpenses > 50) {
    signals.push({
      type: 'spike',
      data: { 
        amount: todayExpenses, 
        avg: Math.round(avgDailySpend),
        percent: Math.round((todayExpenses / avgDailySpend) * 100)
      },
      priority: 'high'
    });
  }

  // --- 2. Budget Depletion Monitoring ---
  // Alerts when categories reach 80% or 100% of their monthly limit.
  for (const budget of budgets) {
    const categorySpent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category && new Date(t.date) >= monthStart)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const usagePercent = (categorySpent / Number(budget.limit_amount)) * 100;
    
    if (usagePercent >= 100) {
      signals.push({
        type: 'budget_exhaustion',
        category: budget.category,
        data: { spent: categorySpent, limit: budget.limit_amount, percent: 100 },
        priority: 'high'
      });
    } else if (usagePercent >= 80) {
      signals.push({
        type: 'budget_exhaustion',
        category: budget.category,
        data: { spent: categorySpent, limit: budget.limit_amount, percent: Math.round(usagePercent) },
        priority: 'medium'
      });
    }
  }

  // --- 3. Habit & Merchant Frequency Detection ---
  // Identifies high-frequency spending at common merchants.
  const HABIT_KEYWORDS = ['zomato', 'swiggy', 'uber', 'amazon', 'starbucks', 'coffee', 'netflix'];
  const recentTransactions = transactions.filter(t => new Date(t.date) >= sevenDaysAgo);
  
  for (const keyword of HABIT_KEYWORDS) {
    const matchingTransactions = recentTransactions.filter(t => 
      t.description?.toLowerCase().includes(keyword) || 
      t.category.toLowerCase().includes(keyword)
    );
    
    // Threshold: 3+ occurrences in a single week
    if (matchingTransactions.length >= 3) {
      signals.push({
        type: 'habit',
        data: { 
          keyword: keyword.charAt(0).toUpperCase() + keyword.slice(1), 
          count: matchingTransactions.length,
          total: matchingTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
        },
        priority: 'medium'
      });
    }
  }

  // --- 4. Savings Milestones & Progress ---
  // Celebrates reach specific percentages of financial goals.
  for (const goal of goals) {
    const progressPercent = (Number(goal.current_amount) / Number(goal.target_amount)) * 100;
    
    if (progressPercent >= 100) {
      signals.push({
        type: 'savings_milestone',
        data: { goal: goal.title, percent: 100 },
        priority: 'high'
      });
    } else if (progressPercent >= 90) {
      signals.push({
        type: 'savings_milestone',
        data: { goal: goal.title, percent: 90 },
        priority: 'medium'
      });
    } else if (progressPercent >= 50) {
      signals.push({
        type: 'savings_milestone',
        data: { goal: goal.title, percent: 50 },
        priority: 'low'
      });
    }
  }

  return signals;
}
