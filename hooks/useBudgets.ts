'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Budget = Database['public']['Tables']['budgets']['Row'];

import { useAuth } from './useAuth';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient() as any;
  const { user, loading: authLoading } = useAuth();

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
      setBudgets((data as Budget[]) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budget: { category: string, limit_amount: number }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await (supabase as any)
        .from('budgets')
        .insert([{ ...budget, user_id: user.id }]);

      if (error) throw error;
      fetchBudgets();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateBudget = async (id: string, updates: { category?: string, limit_amount?: number }) => {
    try {
      const { error } = await (supabase as any)
        .from('budgets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      fetchBudgets();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user, authLoading]);

  return { budgets, loading, error, addBudget, updateBudget, refresh: fetchBudgets };
}
