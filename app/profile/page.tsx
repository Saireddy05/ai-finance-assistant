'use client';

import AppLayout from '@/components/AppLayout';
import { useProfile } from '@/hooks/useProfile';
import { User, Globe, Loader2, CheckCircle, Sparkles, Target, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const GOALS = ['Saving', 'Investing', 'Debt reduction', 'Wealth building'];

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [currency, setCurrency] = useState('USD');
  // Personalization fields
  const [userType, setUserType] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [financialGoals, setFinancialGoals] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setCurrency(profile.currency || 'USD');
      setUserType((profile as any).user_type || '');
      setIncomeRange((profile as any).income_range || '');
      setExperienceLevel((profile as any).experience_level || '');
      setFinancialGoals((profile as any).financial_goals || []);
      setRiskLevel((profile as any).risk_level || '');
    }
  }, [profile]);

  const toggleGoal = (goal: string) => {
    setFinancialGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await updateProfile({
        full_name: fullName,
        currency,
        user_type: userType,
        income_range: incomeRange,
        experience_level: experienceLevel,
        financial_goals: financialGoals,
        risk_level: riskLevel,
        onboarding_completed: true,
      } as any);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all text-white";
  const labelClass = "text-[10px] font-black text-zinc-500 uppercase tracking-widest";
  const selectClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white cursor-pointer";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Profile & Settings</h1>
          <p className="text-zinc-500 font-medium">Manage your account and personalization preferences.</p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center glass-card">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">

            {/* Personal Information */}
            <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-black text-white text-lg">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Email Address</label>
                  <input type="email" value={profile?.email || ''} disabled className={cn(inputClass, "opacity-50 cursor-not-allowed")} />
                </div>
              </div>
            </div>

            {/* App Preferences */}
            <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-black text-white text-lg">App Preferences</h3>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Default Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectClass}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Financial Persona — Personalization Engine */}
            <div className="glass-card p-8 space-y-8 border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg">Financial Persona</h3>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Powers your Smart Advisor</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Redo Onboarding
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>User Type</label>
                  <select value={userType} onChange={(e) => setUserType(e.target.value)} className={selectClass}>
                    <option value="">Select type</option>
                    <option value="Student">Student</option>
                    <option value="Employee">Employee</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Freelancer">Freelancer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Monthly Income Range</label>
                  <select value={incomeRange} onChange={(e) => setIncomeRange(e.target.value)} className={selectClass}>
                    <option value="">Select range</option>
                    <option value="< 10k">{"< ₹10k"}</option>
                    <option value="10k–30k">₹10k – ₹30k</option>
                    <option value="30k–70k">₹30k – ₹70k</option>
                    <option value="70k+">₹70k+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Investing Experience</label>
                  <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className={selectClass}>
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Risk Tolerance</label>
                  <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)} className={selectClass}>
                    <option value="">Select risk level</option>
                    <option value="Low">Conservative (Low Risk)</option>
                    <option value="Medium">Balanced (Medium Risk)</option>
                    <option value="High">Aggressive (High Risk)</option>
                  </select>
                </div>
              </div>

              {/* Financial Goals — Multi-Select */}
              <div className="space-y-3">
                <label className={labelClass}>Financial Goals</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GOALS.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={cn(
                        "py-3 px-4 rounded-2xl border-2 text-xs font-black transition-all flex items-center gap-2",
                        financialGoals.includes(goal)
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      )}
                    >
                      <Target className="w-3 h-3 shrink-0" />
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error & Save */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-4">
              {success && (
                <span className="text-emerald-500 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                  <CheckCircle className="w-4 h-4" />
                  Changes saved successfully!
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !profile}
                className="px-8 py-3 bg-primary text-black rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save All Changes
              </button>
            </div>

          </div>
        )}
      </div>
    </AppLayout>
  );
}
