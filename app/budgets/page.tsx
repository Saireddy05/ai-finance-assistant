'use client';

import AppLayout from '@/components/AppLayout';
import AddBudgetModal from '@/components/AddBudgetModal';
import { useProfile } from '@/hooks/useProfile';
import { useBudgets } from '@/hooks/useBudgets';
import { useTransactions } from '@/hooks/useTransactions';
import { Plus, Wallet, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { getCurrencySymbol } from '@/lib/currency';

export default function BudgetsPage() {
  const { budgets, loading: budgetsLoading, addBudget } = useBudgets();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate spent amount for each budget category
  const { profile } = useProfile();
  const symbol = getCurrencySymbol(profile?.currency || 'USD');

  const budgetsWithSpent = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { ...budget, spent };
  });

  const loading = budgetsLoading || transactionsLoading;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Budgets</h1>
            <p className="text-zinc-500">Set and manage your monthly spending limits.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Budget
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center glass-card">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetsWithSpent.map((budget) => {
              const percentage = Math.min((budget.spent / budget.limit_amount) * 100, 100);
              const isOver = budget.spent > budget.limit_amount;

              return (
                <div key={budget.id} className="glass-card p-6 flex flex-col gap-6 group hover:border-zinc-700 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <Wallet className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg">{budget.category}</h3>
                    </div>
                    {isOver && (
                      <div className="flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-1 rounded text-xs font-bold">
                        <AlertCircle className="w-3 h-3" />
                        OVER
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-sm text-zinc-400">
                        Spent <span className="text-white font-bold">{symbol}{budget.spent.toLocaleString()}</span> of {symbol}{budget.limit_amount.toLocaleString()}
                      </p>
                      <span className={cn(
                        "text-xs font-bold",
                        isOver ? "text-rose-500" : "text-zinc-500"
                      )}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          isOver ? "bg-rose-500" : "bg-primary"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 mt-auto">
                    <span>Remaining: {symbol}{Math.max(budget.limit_amount - budget.spent, 0).toLocaleString()}</span>
                    <span>Ends in 12 days</span>
                  </div>
                </div>
              );
            })}
            
            {budgets.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 h-64 flex flex-col items-center justify-center glass-card border-dashed">
                <p className="text-zinc-500 mb-4">No budgets set yet.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-primary hover:underline text-sm font-bold"
                >
                  Set your first budget goal
                </button>
              </div>
            )}
          </div>
        )}

        <AddBudgetModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addBudget} 
        />
      </div>
    </AppLayout>
  );
}
