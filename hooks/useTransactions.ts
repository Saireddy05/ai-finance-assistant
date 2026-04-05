'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const { checkProactive } = useNotifications();

  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions((data as Transaction[]) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adds a new transaction and refreshes the local state.
   */
  const addTransaction = async (transaction: Omit<TransactionInsert, 'user_id'>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error: insertError } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: user.id }]);

      if (insertError) throw insertError;
      
      // Refresh state to ensure UI and notification engine stay in sync
      await fetchTransactions();
      
      // Trigger AI proactive check after new data is added (Forced bypass of cool-down)
      await checkProactive(true);
    } catch (err: any) {
      const message = err.message || 'Failed to add transaction';
      setError(message);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchTransactions();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Omit<Database['public']['Tables']['transactions']['Update'], 'user_id' | 'id'>>) => {
    try {
      const { error: updateError } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchTransactions();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, authLoading]);

  return { transactions, loading, error, addTransaction, deleteTransaction, updateTransaction, refresh: fetchTransactions };
}
