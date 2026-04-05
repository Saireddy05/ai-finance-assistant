'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Wallet, 
  Target, 
  Briefcase, 
  ShieldCheck,
  ArrowRight,
  X,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, any> = {
  TrendingUp,
  Shield,
  Wallet,
  Target,
  Briefcase,
  ShieldCheck,
};

interface Recommendation {
  title: string;
  description: string;
  icon: string;
  actionLabel?: string;
  actionUrl?: string;
}

interface SmartRecommendationsProps {
  profile: any;
  transactionsSummary: string;
}

export default function SmartRecommendations({ profile, transactionsSummary }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRec, setActiveRec] = useState<Recommendation | null>(null);
  const router = useRouter();

  // Derived stable key — prevents the dependency array from changing size between renders
  const profileKey = profile ? `${(profile as any).user_type || ''}-${(profile as any).income_range || ''}` : '';

  useEffect(() => {
    async function load() {
      if (!profile || !profileKey || profileKey === '-') {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile, transactionsSummary }),
        });
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profileKey, transactionsSummary]);

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveRec(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function handleTakeAction(rec: Recommendation) {
    if (rec.actionUrl) {
      setActiveRec(rec);
    }
  }

  function confirmAction() {
    if (activeRec?.actionUrl) {
      setActiveRec(null);
      router.push(activeRec.actionUrl);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-zinc-900/50 rounded-[2rem] border border-zinc-800" />
        ))}
      </div>
    );
  }

  // If no profile persona is set, show a CTA to complete the setup
  if (recommendations.length === 0 && (!profileKey || profileKey === '-')) {
    return (
      <div className="glass-card p-8 border border-dashed border-primary/30 bg-primary/5 flex items-center gap-6 rounded-3xl">
        <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-white mb-1">Unlock your Smart Advisor</h3>
          <p className="text-sm text-zinc-500">Complete your Financial Persona to get personalized recommendations tailored to your income and goals.</p>
        </div>
        <a href="/profile" className="shrink-0 px-6 py-3 bg-primary text-black text-xs font-black rounded-2xl uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
          Set Up Now
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Smart Advisor</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Personalized for {profile.full_name?.split(' ')[0] || 'User'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, i) => {
            const Icon = ICON_MAP[rec.icon] || Sparkles;
            const hasAction = !!rec.actionUrl;
            return (
              <div 
                key={i} 
                className="group relative glass-card p-6 border border-zinc-900 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl w-fit mb-4 group-hover:border-primary/50 group-hover:text-primary transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="font-black text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
                    {rec.title}
                  </h3>
                  
                  <p className="text-sm text-zinc-500 leading-relaxed mb-6 group-hover:text-zinc-400 flex-1">
                    {rec.description}
                  </p>

                  <button 
                    onClick={() => handleTakeAction(rec)}
                    disabled={!hasAction}
                    className={cn(
                      "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all w-fit",
                      hasAction
                        ? "text-primary hover:gap-3 cursor-pointer"
                        : "text-zinc-700 cursor-not-allowed"
                    )}
                  >
                    {rec.actionLabel || 'Take Action'}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {activeRec && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setActiveRec(null); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Panel */}
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Close */}
            <button 
              onClick={() => setActiveRec(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl w-fit mb-5">
              {(() => { const Icon = ICON_MAP[activeRec.icon] || Sparkles; return <Icon className="w-7 h-7 text-primary" />; })()}
            </div>

            {/* Content */}
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">{activeRec.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">{activeRec.description}</p>

            {/* Destination badge */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Takes you to</span>
              <span className="text-[10px] font-black bg-zinc-900 border border-zinc-800 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
                {activeRec.actionUrl?.replace('/', '') || 'dashboard'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveRec(null)}
                className="flex-1 py-3 rounded-2xl border border-zinc-800 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
              >
                Maybe Later
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 py-3 rounded-2xl bg-primary text-black text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {activeRec.actionLabel || 'Go Now'}
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
