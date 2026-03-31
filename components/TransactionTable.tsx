'use client';

import { format } from 'date-fns';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Trash2, 
  Edit2,
  Tag,
  X,
  Loader2
} from 'lucide-react';
import { Database } from '@/types/supabase';
import { cn } from '@/lib/utils';
import { getCurrencySymbol } from '@/lib/currency';
import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: any) => Promise<void>;
}

function EditModal({ 
  transaction, 
  onClose, 
  onSave 
}: { 
  transaction: Transaction; 
  onClose: () => void; 
  onSave: (id: string, updates: Partial<Omit<Transaction, 'id' | 'user_id'>>) => Promise<void>; 
}) {
  const [type, setType] = useState<'income' | 'expense'>(transaction.type as 'income' | 'expense');
  const [amount, setAmount] = useState(String(transaction.amount));
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date?.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(transaction.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    setLoading(true);
    setError(null);
    try {
      await onSave(transaction.id, {
        type,
        amount: parseFloat(amount),
        category,
        date,
        description,
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Edit Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex p-1 bg-zinc-900 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${type === 'expense' ? 'bg-rose-500 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${type === 'income' ? 'bg-emerald-500 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Income
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Amount</label>
              <input 
                type="number" 
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase">Category</label>
            <input 
              type="text" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Salary, Rent, Food"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase">Description (Optional)</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
              {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TransactionTable({ transactions, onDelete, onUpdate }: TransactionTableProps) {
  const { profile } = useProfile();
  const symbol = getCurrencySymbol(profile?.currency || 'USD');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  return (
    <>
      {editingTransaction && (
        <EditModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={onUpdate}
        />
      )}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-800/30 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                  {format(new Date(t.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <span className="font-medium text-sm text-white group-hover:text-primary transition-colors">
                      {t.description || t.category}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                    <Tag className="w-3 h-3" />
                    {t.category}
                  </span>
                </td>
                <td className={cn(
                  "px-6 py-4 whitespace-nowrap text-sm font-bold",
                  t.type === 'income' ? "text-emerald-500" : "text-white"
                )}>
                  {t.type === 'income' ? '+' : '-'} {symbol}{t.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingTransaction(t)}
                      className="p-1.5 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-colors"
                      title="Edit transaction"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-1.5 hover:bg-rose-500/10 hover:text-rose-500 rounded-md text-zinc-400 transition-colors"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm">
                  No transactions found. Add your first transaction to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
