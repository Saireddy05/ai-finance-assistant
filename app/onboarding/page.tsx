'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { 
  Users, 
  Briefcase, 
  Store, 
  Terminal, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  Wallet,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

type OnboardingData = {
  user_type: string;
  income_range: string;
  experience_level: string;
  financial_goals: string[];
  risk_level: string;
};

const STEPS = [
  { id: 'type', title: 'What best describes you?', subtitle: 'We\'ll tailor your experience based on your current life stage.' },
  { id: 'income', title: 'Your Monthly Income', subtitle: 'How much are you currently working with each month?' },
  { id: 'experience', title: 'Investing Experience', subtitle: 'Are you just starting, or are you a market veteran?' },
  { id: 'goals', title: 'Financial Ambitions', subtitle: 'What are your primary goals for the next year?' },
  { id: 'risk', title: 'Risk Tolerance', subtitle: 'How comfortable are you with market fluctuations?' }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<OnboardingData>({
    user_type: '',
    income_range: '',
    experience_level: '',
    financial_goals: [],
    risk_level: ''
  });

  const nextStep = () => currentStep < STEPS.length - 1 && setCurrentStep(curr => curr + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(curr => curr - 1);

  const handleSubmit = async () => {
    if (!user) {
      console.error('Onboarding Error: No user found.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          user_type: data.user_type,
          income_range: data.income_range,
          experience_level: data.experience_level,
          financial_goals: data.financial_goals,
          risk_level: data.risk_level,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Supabase Onboarding Error:', error.message, error.details, error.hint);
        throw new Error(error.message || 'Failed to save your profile. Please run the SQL schema update in Supabase.');
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Onboarding Error:', err.message || err);
      alert(`Error: ${err.message || 'Please run the SQL schema update in your Supabase dashboard.'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'Student', icon: Users, label: 'Student', sub: 'Learning and saving.' },
              { id: 'Employee', icon: Briefcase, label: 'Employee', sub: 'Salary & tax planning.' },
              { id: 'Business Owner', icon: Store, label: 'Business Owner', sub: 'Cash flow & scaling.' },
              { id: 'Freelancer', icon: Terminal, label: 'Freelancer', sub: 'Variable income focus.' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setData({ ...data, user_type: type.id })}
                className={cn(
                  "p-6 text-left rounded-3xl border-2 transition-all group active:scale-95",
                  data.user_type === type.id 
                    ? "bg-primary/20 border-primary shadow-primary/20" 
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <type.icon className={cn("w-8 h-8 mb-4", data.user_type === type.id ? "text-primary" : "text-zinc-500")} />
                <h3 className="font-bold text-white">{type.label}</h3>
                <p className="text-sm text-zinc-500">{type.sub}</p>
              </button>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 gap-4">
            {['< 10k', '10k–30k', '30k–70k', '70k+'].map(range => (
              <button
                key={range}
                onClick={() => setData({ ...data, income_range: range })}
                className={cn(
                  "p-6 flex items-center justify-between rounded-3xl border-2 transition-all active:scale-95",
                  data.income_range === range 
                    ? "bg-primary/20 border-primary" 
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className="flex items-center gap-4">
                  <Wallet className={cn("w-6 h-6", data.income_range === range ? "text-primary" : "text-zinc-500")} />
                  <span className="font-bold text-white text-lg">₹{range}</span>
                </div>
                {data.income_range === range && <CheckCircle2 className="text-primary w-6 h-6" />}
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4">
             {['Beginner', 'Intermediate', 'Advanced'].map(level => (
               <button
                 key={level}
                 onClick={() => setData({ ...data, experience_level: level })}
                 className={cn(
                   "p-6 flex items-center justify-between rounded-3xl border-2 transition-all active:scale-95 text-left",
                   data.experience_level === level 
                     ? "bg-primary/20 border-primary" 
                     : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                 )}
               >
                 <span className="font-bold text-white text-lg">{level}</span>
                 {data.experience_level === level && <CheckCircle2 className="text-primary w-6 h-6" />}
               </button>
             ))}
          </div>
        );
      case 3:
        const goals = ['Saving', 'Investing', 'Debt reduction', 'Wealth building'];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {goals.map(goal => (
               <button
                 key={goal}
                 onClick={() => {
                   const exists = data.financial_goals.includes(goal);
                   setData({
                     ...data,
                     financial_goals: exists 
                       ? data.financial_goals.filter(g => g !== goal)
                       : [...data.financial_goals, goal]
                   });
                 }}
                 className={cn(
                   "p-6 flex flex-col rounded-3xl border-2 transition-all active:scale-95 text-left",
                   data.financial_goals.includes(goal) 
                     ? "bg-primary/20 border-primary" 
                     : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                 )}
               >
                 <Target className={cn("w-10 h-10 mb-4", data.financial_goals.includes(goal) ? "text-primary" : "text-zinc-700")} />
                 <span className="font-bold text-white">{goal}</span>
               </button>
             ))}
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6">
            {[
              { id: 'Low', label: 'Conservative (Low Risk)', sub: 'Protect capital, minimal returns.' },
              { id: 'Medium', label: 'Balanced (Medium Risk)', sub: 'Wealth growth with some stability.' },
              { id: 'High', label: 'Aggressive (High Risk)', sub: 'Maximum growth potential, high volatility.' }
            ].map(risk => (
              <button
                key={risk.id}
                onClick={() => setData({ ...data, risk_level: risk.id })}
                className={cn(
                  "p-6 flex flex-col rounded-3xl border-2 transition-all active:scale-95 text-left",
                  data.risk_level === risk.id 
                    ? "bg-primary/20 border-primary" 
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">{risk.label}</h3>
                  {data.risk_level === risk.id && <ShieldCheck className="text-primary w-6 h-6" />}
                </div>
                <p className="text-sm text-zinc-500">{risk.sub}</p>
              </button>
            ))}
          </div>
        );
    }
  };

  const isStepValid = () => {
    switch(currentStep) {
      case 0: return data.user_type !== '';
      case 1: return data.income_range !== '';
      case 2: return data.experience_level !== '';
      case 3: return data.financial_goals.length > 0;
      case 4: return data.risk_level !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 sm:p-20 font-sans selection:bg-primary/30">
      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-zinc-950/80 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 shadow-2xl shadow-black">
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-12">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-700",
                i <= currentStep ? "bg-primary" : "bg-zinc-900"
              )} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="flex flex-col h-full"
          >
            <div className="space-y-2 mb-10">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
                <Sparkles className="w-3 h-3" />
                Personal Advisor Initialization
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-1">
                {STEPS[currentStep].title}
              </h1>
              <p className="text-zinc-500 font-medium">{STEPS[currentStep].subtitle}</p>
            </div>

            <div className="flex-1 min-h-[350px]">
              {renderStep()}
            </div>

            <div className="flex items-center justify-between mt-12 pt-10 border-t border-zinc-900">
              <button
                onClick={prevStep}
                disabled={currentStep === 0 || loading}
                className={cn(
                  "p-4 rounded-full border border-zinc-800 transition-all text-zinc-500 hover:text-white hover:border-zinc-700 disabled:opacity-0",
                )}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                disabled={!isStepValid() || loading}
                onClick={currentStep === STEPS.length - 1 ? handleSubmit : nextStep}
                className={cn(
                  "px-8 py-4 rounded-full font-black text-sm tracking-widest uppercase transition-all flex items-center gap-3",
                  isStepValid() 
                    ? "bg-primary text-black shadow-xl shadow-primary/20 active:scale-95" 
                    : "bg-zinc-900 text-zinc-600 grayscale pointer-events-none"
                )}
              >
                {loading ? (
                  <Sparkles className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {currentStep === STEPS.length - 1 ? 'Build Advisor' : 'Next Intelligence'}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
