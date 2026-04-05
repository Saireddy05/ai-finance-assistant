'use client';

import { useState } from 'react';
import { X, Loader2, PiggyBank, Calendar } from 'lucide-react';

interface AddSavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: {
    title: string;
    target_amount: number;
    current_amount: number;
    deadline?: string | null;
  }) => Promise<void>;
  currencySymbol?: string;
}

export default function AddSavingsGoalModal({ isOpen, onClose, onAdd, currencySymbol = '₹' }: AddSavingsGoalModalProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [alreadySaved, setAlreadySaved] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    setLoading(true);
    setError(null);

    try {
      await onAdd({
        title,
        target_amount: parseFloat(targetAmount),
        current_amount: alreadySaved ? parseFloat(alreadySaved) : 0,
        deadline: deadline || null,
      });
      onClose();
      setTitle('');
      setTargetAmount('');
      setAlreadySaved('');
      setDeadline('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_GOALS = ['Emergency Fund', 'Dream Vacation', 'New Laptop', 'Car', 'Home Down Payment', 'Wedding'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200 border border-zinc-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <PiggyBank className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">New Savings Goal</h2>
            <p className="text-xs text-zinc-500">Define your target and start saving</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick select chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase">Quick Select</label>
            <div className="flex flex-wrap gap-2">
              {QUICK_GOALS.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setTitle(g)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                    title === g
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase">Goal Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Emergency Fund"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase">Target Amount ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Already Saved */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase">Already Saved ({currencySymbol}) <span className="normal-case text-zinc-600 font-normal">(optional)</span></label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={alreadySaved}
              onChange={(e) => setAlreadySaved(e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Target Date <span className="normal-case text-zinc-600 font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-300"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-black font-bold py-2.5 rounded-lg hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : 'Create Goal'}
          </button>
        </form>
      </div>
    </div>
  );
}
