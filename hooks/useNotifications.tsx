'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { toast } from 'sonner';
import { 
  AlertTriangle, 
  PartyPopper, 
  Sparkles, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Notification = Database['public']['Tables']['notifications']['Row'];

import { useAuth } from './useAuth';

import { analyzeFinancialSignals, FinancialSignal } from '@/lib/notifications-engine';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const subscriptionRef = useRef<any>(null);

  const isGeneratingRef = useRef(false);

  /**
   * Generates proactive AI notifications based on new financial data.
   * This logic is deduplicated via 'notification_history' to avoid alert spam.
   */
  const generateProactiveNotifications = async (
    transactions: Database['public']['Tables']['transactions']['Row'][],
    budgets: Database['public']['Tables']['budgets']['Row'][],
    userId: string
  ) => {
    // 0. Simultaneous Execution Guard
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;

    try {
      // 1. Fetch Savings Goals (Defensive)
      let goals: Database['public']['Tables']['savings_goals']['Row'][] = [];
      try {
        const { data } = await supabase.from('savings_goals').select('*').eq('user_id', userId);
        goals = data || [];
      } catch (e) {
        console.warn('Savings goals table might be missing:', e);
      }
      
      // 2. Run Intelligence Engine to detect spikes, habits, and milestones
      let signals: FinancialSignal[] = analyzeFinancialSignals(transactions, budgets, goals);
      
      if (signals.length > 0) {
        // Sort by priority (High > Medium > Low) and take ONLY the top signal 
        // to prevent multiple simultaneous AI calls/notifications.
        const priorityScore = { high: 3, medium: 2, low: 1 };
        signals = signals
          .sort((a, b) => (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0))
          .slice(0, 1);

        // 3. Fetch History (Defensive) to prevent double-sending
        let sentTitles = new Set<string>();
        try {
          const { data: historyData } = await supabase
            .from('notification_history')
            .select('title')
            .eq('user_id', userId);
          sentTitles = new Set(historyData?.map((h) => h.title) || []);
        } catch (e) {
          console.warn('Notification history table might be missing:', e);
        }

        for (const signal of signals) {
          try {
             // 4. Request personalized AI content from the LLM
             const res = await fetch('/api/notifications/generate', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ signal, userId })
             });
             const aiData = await res.json();

             // Only proceed if the AI-generated title is new
             if (aiData.title && !sentTitles.has(aiData.title)) {
                // 5. Insert valid Notification record
                const { data: newNotif, error: insError } = await (supabase as any)
                  .from('notifications')
                  .insert({
                    user_id: userId,
                    title: aiData.title,
                    message: aiData.message,
                    type: aiData.type || 'info'
                  })
                  .select()
                  .single();

                if (!insError && newNotif) {
                  // 6. Record in persistent history for future deduplication
                  await (supabase as any).from('notification_history').insert({
                    user_id: userId,
                    title: aiData.title,
                    category: signal.type
                  });

                  // Trigger UI Toast Feedback
                  triggerToast(newNotif);
                  sentTitles.add(aiData.title);
                }
             }
          } catch (aiErr) {
             console.error('AI Notification Generation Failed:', aiErr);
          }
        }
        fetchNotifications();
      }

      // Record successful run for cool-down
      localStorage.setItem(`last_proactive_${userId}`, Date.now().toString());
    } catch (err) {
      console.error('Core Proactive Engine Error:', err);
    } finally {
      isGeneratingRef.current = false;
    }
  };

  /**
   * Refreshes AI insights only if needed or when specific events (like adding an expense) occur.
   */
  const checkProactive = async (force: boolean = false) => {
    if (!user) return;

    // 10-minute Cool-down check (Bypassed if forced by a specific event)
    if (!force) {
      const lastCheck = localStorage.getItem(`last_proactive_${user.id}`);
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;
      
      if (lastCheck && (now - parseInt(lastCheck)) < tenMinutes) {
        console.log('Skipping proactive check (Cool-down)');
        return;
      }
    }

    const { data: transactions } = await (supabase as any).from('transactions').select('*').eq('user_id', user.id);
    const { data: budgets } = await (supabase as any).from('budgets').select('*').eq('user_id', user.id);
    
    if (transactions && budgets) {
      await generateProactiveNotifications(transactions, budgets, user.id);
    }
  };

  const triggerToast = (n: any) => {
    const isBudget = n.title?.includes('Budget') || n.type === 'warning';
    const isSuccess = n.type === 'success';
    const isAI = n.title?.includes('AI');

    toast.custom((t: any) => (
      <div 
        onClick={async () => {
          if (n.id) await markAsRead(n.id);
          toast.dismiss(t.id);
        }}
        className={cn(
          "relative w-[350px] bg-zinc-900 border overflow-hidden p-5 rounded-[2rem] shadow-2xl transition-all duration-500 cursor-pointer group/toast active:scale-95",
          isBudget ? "border-rose-500/30 hover:border-rose-500/50" : isSuccess ? "border-emerald-500/30 hover:border-emerald-500/50" : "border-primary/30 hover:border-primary/50",
          t.visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95"
        )}
      >
        {/* Animated Background Accent */}
        <div className={cn(
          "absolute -right-8 -top-8 w-32 h-32 blur-[60px] opacity-20 rounded-full transition-opacity duration-500 group-hover/toast:opacity-30",
          isBudget ? "bg-rose-500" : isSuccess ? "bg-emerald-500" : "bg-primary"
        )} />

        <div className="flex items-start gap-4 h-full relative z-10">
          <div className={cn(
            "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover/toast:scale-110",
            isBudget ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : 
            isSuccess ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : 
            "bg-primary/10 border-primary/20 text-primary"
          )}>
            {isBudget ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : 
             isSuccess ? <PartyPopper className="w-6 h-6" /> : 
             <Sparkles className="w-6 h-6" />}
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">
              {n.title}
            </h4>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              {n.message}
            </p>
            {isBudget && (
              <div className="mt-3 flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                 <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Urgent Attention</span>
              </div>
            )}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
            }}
            className="shrink-0 p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-600 hover:text-white transition-colors relative z-20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
    });
  };

  const fetchNotifications = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_dismissed', false)
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
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
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

      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const clearAll = async () => {
    try {
      if (!user) return;

      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_dismissed: true })
        .eq('user_id', user.id);

      if (error) throw error;
      setNotifications([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Realtime subscription and initial load
  useEffect(() => {
    if (!user || authLoading) return;

    fetchNotifications();

    // Subscribe to REALTIME notification changes
    const channel = (supabase as any)
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Only listen for new entries, never trigger generation from realtime
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          const newNotif = payload.new;
          setNotifications(prev => [newNotif, ...prev]);
          triggerToast(newNotif);
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [user, authLoading]);

  return { notifications, loading, error, markAsRead, markAllAsRead, clearAll, checkProactive, refresh: fetchNotifications };
}
