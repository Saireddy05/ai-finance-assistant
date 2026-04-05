'use client';

import AppLayout from '@/components/AppLayout';
import AddBudgetModal from '@/components/AddBudgetModal';
import AddSavingsGoalModal from '@/components/AddSavingsGoalModal';
import { useProfile } from '@/hooks/useProfile';
import { useBudgets } from '@/hooks/useBudgets';
import { useTransactions } from '@/hooks/useTransactions';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { Plus, Wallet, AlertCircle, PiggyBank, PencilLine, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { getCurrencySymbol } from '@/lib/currency';

export default function BudgetsPage() {
  const { budgets, loading: budgetsLoading, addBudget } = useBudgets();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { goals, loading: goalsLoading, addGoal, contributeToGoal, deleteGoal } = useSavingsGoals();
  const { profile, loading: profileLoading } = useProfile();
  
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Calculate spent amount for each budget category
  const symbol = getCurrencySymbol(profile?.currency || 'USD');

  const budgetsWithSpent = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { ...budget, spent };
  });

  const loading = budgetsLoading || transactionsLoading || goalsLoading || profileLoading;

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Spending Budgets Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Spending Budgets</h2>
              <p className="text-xs text-zinc-500 font-medium">Set and manage your monthly spending limits.</p>
            </div>
            <button 
              onClick={() => setIsBudgetModalOpen(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Create Budget
            </button>
          </div>

          {loading ? (
            <div className="h-48 flex items-center justify-center glass-card">
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
                        <div className="flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-1 rounded text-xs font-bold transition-all animate-in zoom-in duration-300">
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
                      <span>Ends in {Math.ceil((new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                  </div>
                );
              })}
              
              {!loading && budgets.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 h-48 flex flex-col items-center justify-center glass-card border-dashed">
                  <Wallet className="w-8 h-8 text-zinc-700 mb-3" />
                  <p className="text-zinc-500 text-sm mb-4">No spending budgets set yet.</p>
                  <button 
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="text-primary hover:underline text-sm font-bold"
                  >
                    Set your first budget
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Savings Goals Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Savings Goals</h2>
              <p className="text-xs text-zinc-500 font-medium">Track progress towards your long-term aims.</p>
            </div>
            <button 
              onClick={() => setIsGoalModalOpen(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Create Goal
            </button>
          </div>

          {loading ? (
            <div className="h-48 flex items-center justify-center glass-card border-zinc-800">
               <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                const isCompleted = goal.status === 'completed' || percentage >= 100;

                return (
                  <div key={goal.id} className="glass-card p-6 flex flex-col gap-6 group hover:border-zinc-700 transition-all relative overflow-hidden">
                     {isCompleted && (
                       <div className="absolute inset-0 bg-emerald-500/5 z-0 pointer-events-none" />
                     )}
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors duration-300",
                          isCompleted ? "bg-emerald-500/20" : "bg-emerald-500/10"
                        )}>
                          <PiggyBank className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-lg truncate max-w-[140px]" title={goal.title}>{goal.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <div className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-sm border border-emerald-500/20">
                            Achieved
                          </div>
                        )}
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the goal "${goal.title}"?`)) {
                              deleteGoal(goal.id);
                            }
                          }}
                          className="p-1.5 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-end">
                        <p className="text-sm text-zinc-400">
                          Saved <span className="text-white font-bold">{symbol}{goal.current_amount.toLocaleString()}</span> of {symbol}{goal.target_amount.toLocaleString()}
                        </p>
                        <span className={cn(
                          "text-xs font-bold",
                          isCompleted ? "text-emerald-400" : "text-emerald-500"
                        )}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            isCompleted ? "bg-emerald-400" : "bg-emerald-500"
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto relative z-10 pt-2">
                       {!isCompleted && (
                          <button 
                            onClick={async () => {
                              const amt = prompt(`How much are you adding to "${goal.title}"?`);
                              if (amt && !isNaN(Number(amt)) && Number(amt) > 0) {
                                await contributeToGoal(goal.id, Number(amt));
                              }
                            }}
                            className="flex-1 bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-xs font-bold text-zinc-300 py-2 rounded-lg transition-all"
                          >
                            Add Funds
                          </button>
                       )}
                       {goal.deadline && (
                         <div className="flex-1 flex items-center justify-center text-[10px] text-zinc-500 uppercase font-black bg-zinc-900 border border-zinc-800 rounded-lg">
                           Due: {new Date(goal.deadline).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                         </div>
                       )}
                    </div>
                  </div>
                );
              })}
              
              {!loading && goals.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 h-48 flex flex-col items-center justify-center glass-card border-dashed hover:border-emerald-500/30 transition-colors group cursor-pointer" onClick={() => setIsGoalModalOpen(true)}>
                  <PiggyBank className="w-8 h-8 text-zinc-700 mb-3 group-hover:text-emerald-500/50 transition-colors" />
                  <p className="text-zinc-500 text-sm mb-4">No savings goals active.</p>
                  <span className="text-emerald-500 hover:text-emerald-400 font-bold text-sm">
                    Start a new goal
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        <AddBudgetModal 
          isOpen={isBudgetModalOpen} 
          onClose={() => setIsBudgetModalOpen(false)} 
          onAdd={addBudget} 
        />
        
        <AddSavingsGoalModal
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          onAdd={addGoal}
          currencySymbol={symbol}
        />
      </div>
    </AppLayout>
  );
}
