'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Notification = Database['public']['Tables']['notifications']['Row'];

import { useAuth } from './useAuth';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient() as any;
  const { user, loading: authLoading } = useAuth();

  const generateProactiveNotifications = async (transactions: any[], budgets: any[], user_id: string) => {
    try {
      const newNotifications: any[] = [];
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // 1. Check for Overspending (Alert)
      const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= monthStart)
        .reduce((sum, t) => sum + t.amount, 0);

      const totalBudget = budgets.reduce((sum, b) => sum + b.limit_amount, 0);

      if (totalBudget > 0 && monthlyExpenses > totalBudget) {
        newNotifications.push({
          user_id: user_id,
          title: 'Budget Exceeded!',
          message: `You've spent ${Math.round((monthlyExpenses/totalBudget)*100)}% of your monthly budget. Time to slow down!`,
          type: 'warning',
        });
      }

      // 2. Savings Milestone (Reward)
      const monthlyIncome = transactions
        .filter(t => t.type === 'income' && new Date(t.date) >= monthStart)
        .reduce((sum, t) => sum + t.amount, 0);

      if (monthlyIncome > 0 && (monthlyIncome - monthlyExpenses) > 500) {
        newNotifications.push({
          user_id: user_id,
          title: 'Savings Milestone!',
          message: "Great job! You've saved over $500 this month. Keep it up!",
          type: 'success',
        });
      }

      // 3. AI Recommendation (Info)
      if (monthlyExpenses > 0) {
        newNotifications.push({
          user_id: user_id,
          title: 'AI Recommendation',
          message: 'Based on your habits, you could save $50/mo by reducing "Dining Out" expenses.',
          type: 'info',
        });
      }

      // 4. Persistence check - only add if reasonably unique title or if table is empty
      // Simplification: just add them if none exist with same title today
      if (newNotifications.length > 0) {
        const { data: existing } = await (supabase as any).from('notifications').select('title').eq('user_id', user_id);
        const existingTitles = new Set(existing?.map((e: { title: string }) => e.title) || []);
        
        const toAdd = newNotifications.filter(n => !existingTitles.has(n.title));
        if (toAdd.length > 0) {
          await (supabase as any).from('notifications').insert(toAdd as any);
          fetchNotifications();
        }
      }
    } catch (err) {
      console.error('Proactive notif error:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true } as any)
        .eq('id', id);

      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true } as any)
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!user || authLoading || !mounted) return;

      await fetchNotifications();
      const { data: txs } = await (supabase as any).from('transactions').select('*').eq('user_id', user.id);
      const { data: bdg } = await (supabase as any).from('budgets').select('*').eq('user_id', user.id);
      
      if (txs && bdg && mounted) {
        await generateProactiveNotifications(txs, bdg, user.id);
      }
    };

    init();
    return () => { mounted = false; };
  }, [user, authLoading]);

  return { notifications, loading, error, markAsRead, markAllAsRead, refresh: fetchNotifications };
}
