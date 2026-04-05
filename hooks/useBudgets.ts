'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Budget = Database['public']['Tables']['budgets']['Row'];

import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const { checkProactive } = useNotifications();

  const cleanupOldBudgets = async (fetchedBudgets: Budget[]) => {
    if (!user || fetchedBudgets.length === 0) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const oldBudgets = fetchedBudgets.filter(budget => {
      const budgetDate = new Date(budget.created_at);
      return budgetDate.getMonth() !== currentMonth || budgetDate.getFullYear() !== currentYear;
    });

    if (oldBudgets.length > 0) {
      console.log(`Cleaning up ${oldBudgets.length} old budgets...`);
      const oldIds = oldBudgets.map(b => b.id);
      
      try {
        const { error } = await supabase
          .from('budgets')
          .delete()
          .in('id', oldIds);
        
        if (error) throw error;
        
        // Refresh after deletion to only show current budgets
        setBudgets(prev => prev.filter(b => !oldIds.includes(b.id)));
      } catch (err) {
        console.error('Failed to cleanup old budgets:', err);
      }
    }
  };

  const fetchBudgets = async () => {
    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('budgets')
        .select('*');

      if (error) throw error;
      const allBudgets = (data as Budget[]) || [];
      setBudgets(allBudgets);
      
      // Trigger cleanup for any budgets from a previous month
      await cleanupOldBudgets(allBudgets);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adds a new budget category and limit.
   */
  const addBudget = async (budget: { category: string, limit_amount: number }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('budgets')
        .insert([{ ...budget, user_id: user.id }]);

      if (error) throw error;
      
      // Ensure local state is synchronized
      await fetchBudgets();

      // Trigger AI proactive check (Forced bypass)
      await checkProactive(true);
    } catch (err: any) {
      const message = err.message || 'Failed to add budget';
      setError(message);
    }
  };

  /**
   * Updates an existing budget limit or category.
   */
  const updateBudget = async (id: string, updates: { category?: string, limit_amount?: number }) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      // Ensure local state is synchronized
      await fetchBudgets();

      // Trigger AI proactive check (Forced bypass)
      await checkProactive(true);
    } catch (err: any) {
      const message = err.message || 'Failed to update budget';
      setError(message);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user, authLoading]);

  return { budgets, loading, error, addBudget, updateBudget, refresh: fetchBudgets };
}
