'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

type SavingsGoal = Database['public']['Tables']['savings_goals']['Row'];

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient() as any;
  const { user, loading: authLoading } = useAuth();

  const fetchGoals = async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals((data as SavingsGoal[]) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: {
    title: string;
    target_amount: number;
    current_amount: number;
    deadline?: string | null;
  }) => {
    if (!user) throw new Error('User not authenticated');
    const { error } = await supabase
      .from('savings_goals')
      .insert([{ ...goal, user_id: user.id, status: 'active' }]);
    if (error) throw error;
    await fetchGoals();
  };

  const contributeToGoal = async (id: string, addAmount: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const newAmount = Math.min(goal.current_amount + addAmount, goal.target_amount);
    const newStatus = newAmount >= goal.target_amount ? 'completed' : 'active';
    const { error } = await supabase
      .from('savings_goals')
      .update({ current_amount: newAmount, status: newStatus })
      .eq('id', id);
    if (error) throw error;
    await fetchGoals();
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase
      .from('savings_goals')
      .update({ status: 'cancelled' })
      .eq('id', id);
    if (error) throw error;
    await fetchGoals();
  };

  useEffect(() => {
    fetchGoals();
  }, [user, authLoading]);

  return { goals, loading, error, addGoal, contributeToGoal, deleteGoal, refresh: fetchGoals };
}
