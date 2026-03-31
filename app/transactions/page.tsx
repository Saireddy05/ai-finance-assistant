'use client';

import AppLayout from '@/components/AppLayout';
import TransactionTable from '@/components/TransactionTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import { useTransactions } from '@/hooks/useTransactions';
import { Plus, Filter, Download } from 'lucide-react';
import { useState } from 'react';

export default function TransactionsPage() {
  const { transactions, loading, addTransaction, deleteTransaction, updateTransaction } = useTransactions();
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handleExport = () => {
    if (filteredTransactions.length === 0) return;
    
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        `"${t.description || t.category}"`,
        t.category,
        t.amount,
        t.type
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Transactions</h1>
            <p className="text-zinc-500">Manage and track all your financial activities.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between glass-card p-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${filter === 'all' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-zinc-400 hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('income')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${filter === 'income' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-400 hover:text-white'}`}
            >
              Income
            </button>
            <button 
              onClick={() => setFilter('expense')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${filter === 'expense' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'text-zinc-400 hover:text-white'}`}
            >
              Expenses
            </button>
          </div>
          <button className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center glass-card">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <TransactionTable 
            transactions={filteredTransactions} 
            onDelete={deleteTransaction}
            onUpdate={updateTransaction}
          />
        )}

        <AddTransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addTransaction} 
        />
      </div>
    </AppLayout>
  );
}
