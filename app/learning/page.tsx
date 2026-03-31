'use client';

import AppLayout from '@/components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Star, 
  Lock, 
  CheckCircle2, 
  Play, 
  Zap, 
  Gamepad2,
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import LessonOverlay from '@/components/learning/LessonOverlay';
import QuizCard from '@/components/learning/QuizCard';
import { useTransactions } from '@/hooks/useTransactions';

// Mock Lessons & Quizzes
const MOCK_LESSON = {
  id: 1,
  title: "Mastering the Monthly Budget",
  xpReward: 150,
  sections: [
    {
      title: "What is a Budget?",
      content: "A budget is simply a plan for your money. It's not about restriction—it's about intentionality. By tracking where every dollar goes, you gain the power to direct your wealth toward what truly matters to you.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "The 50/30/20 Rule",
      content: "One of the most popular budgeting methods. 50% of your income goes to Needs (rent, food), 30% to Wants (entertainment), and 20% to Savings or Debt repayment. It's a balanced way to live well today while securing tomorrow.",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80"
    }
  ]
};

const MOCK_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "In the 50/30/20 rule, what does the 20% represent?",
    options: ["Wants & Fun", "Needs & Rent", "Savings & Debt", "Taxes"],
    correctIndex: 2,
    explanation: "The 20% is reserved for your future self—either building savings or paying off high-interest debt."
  },
  {
    id: 2,
    question: "T/F: A budget is primarily designed to stop you from spending money.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation: "False! A budget is a tool to help you spend INTENTIONALLY on things that matter."
  }
];

// Mock Levels Data
const LEVELS = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Level ${i + 1}: ${['Budgeting Intro', 'Saving Hacks', 'Investing 101', 'Tax Optimization', 'Debt Management'][i % 5]}`,
  xp: (i + 1) * 100,
  status: i === 0 ? 'active' : i < 5 ? 'unlocked' : 'locked',
  isCompleted: i < 0
}));

export default function LearningPage() {
  const { transactions } = useTransactions();
  const [userXP, setUserXP] = useState(1250);
  const [streak, setStreak] = useState(5);
  const [level, setLevel] = useState(4);
  
  const [showLesson, setShowLesson] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeLevel, setActiveLevel] = useState<any>(null);

  const aiRecommendation = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories: Record<string, number> = {};
    expenses.forEach(t => categories[t.category] = (categories[t.category] || 0) + t.amount);
    
    if (categories['Food'] > 500) return 'Managing Dining Out';
    if (Object.keys(categories).length > 10) return 'Complexity Management';
    return 'Investment Basics';
  }, [transactions]);

  const handleLevelClick = (lvl: any) => {
    setActiveLevel(lvl);
    setShowLesson(true);
  };

  const handleLessonComplete = () => {
    setShowLesson(false);
    setShowQuiz(true);
  };

  const handleQuizComplete = (success: boolean) => {
    if (success) {
      setUserXP(prev => prev + (activeLevel?.xp || 100));
      // In a real app, update DB here
    }
    setShowQuiz(false);
    setActiveLevel(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 flex items-center justify-between overflow-hidden relative"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Level</p>
              <h2 className="text-4xl font-extrabold text-primary">Lvl {level}</h2>
            </div>
            <Trophy className="w-12 h-12 text-primary opacity-20" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 flex flex-col justify-between overflow-hidden relative"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Experience Points</p>
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-extrabold">{userXP}</h2>
                <span className="text-xs text-zinc-500">/ 5000 XP</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(userXP / 5000) * 100}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 flex items-center justify-between overflow-hidden relative"
          >
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl" />
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Daily Streak</p>
              <div className="flex items-center gap-2">
                <h2 className="text-4xl font-extrabold text-rose-500">{streak} Days</h2>
                <Flame className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Learning Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Level Map */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Finance Quest</h1>
                <p className="text-zinc-500">Master the game of money. One level at a time.</p>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 glass-card border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2">
                   <Gamepad2 className="w-4 h-4 text-emerald-500" />
                   <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Start Playing</span>
                </div>
              </div>
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {LEVELS.map((lvl) => (
                <motion.div
                  key={lvl.id}
                  variants={item}
                  onClick={() => lvl.status !== 'locked' && handleLevelClick(lvl)}
                  whileHover={{ scale: lvl.status === 'locked' ? 1 : 1.02, y: lvl.status === 'locked' ? 0 : -5 }}
                  className={cn(
                    "glass-card p-6 flex flex-col gap-4 relative transition-all duration-300 group cursor-pointer border-zinc-800 bg-zinc-900/40",
                    lvl.status === 'locked' ? 'opacity-50 grayscale pointer-events-none' : 'hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10',
                    lvl.status === 'active' && 'border-primary bg-primary/10 ring-1 ring-primary/50'
                  )}
                >
                  {lvl.status === 'active' && (
                    <div className="absolute -top-3 -right-3 bg-primary text-black text-[10px] font-black px-2 py-1 rounded-md rotate-12 shadow-xl z-10">
                      NEXT UP
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl",
                      lvl.status === 'unlocked' || lvl.status === 'active' ? "bg-primary/10 text-primary border border-primary/20" : "bg-zinc-800 text-zinc-500"
                    )}>
                      {lvl.id}
                    </div>
                    {lvl.status === 'locked' ? (
                      <Lock className="w-5 h-5 text-zinc-600" />
                    ) : lvl.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-full">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold text-amber-500">{lvl.xp} XP</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors text-white">{lvl.title}</h3>
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={cn("h-1 flex-1 rounded-full", i < 2 ? "bg-primary/30" : "bg-zinc-800")} />
                      ))}
                    </div>
                  </div>

                  <button className={cn(
                    "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                    lvl.status === 'active' ? "bg-primary text-black hover:opacity-90 shadow-lg shadow-primary/20" : "bg-zinc-800 border border-zinc-700 text-zinc-400 group-hover:text-white"
                  )}>
                    {lvl.status === 'active' ? <><Play className="w-4 h-4" /> Start Level</> : 'Completed'}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar - Achievements & Challenges */}
          <div className="space-y-10">
             {/* Continue Section */}
            <div className="glass-card p-6 border-primary/20 bg-primary/5">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Pick up where you left</p>
                <div className="flex gap-4 items-center">
                   <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 relative group overflow-hidden">
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <TrendingUp className="w-8 h-8 text-primary" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1 text-white">{aiRecommendation}</h4>
                      <p className="text-[10px] text-zinc-400">Recommended for you</p>
                      <div className="h-1 w-full bg-zinc-800 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-primary w-[30%]" />
                      </div>
                   </div>
                </div>
            </div>

            {/* Daily Challenges */}
            <div className="space-y-4">
               <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                 <Star className="w-5 h-5 text-amber-500" />
                 Daily Quests
               </h3>
               {[
                 { title: 'Save ₹100 today', xp: 50, completed: true },
                 { title: 'Track 3 expenses', xp: 100, completed: false },
                 { title: 'Read 2 lessons', xp: 150, completed: false }
               ].map((q, i) => (
                 <div key={i} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-zinc-700 bg-zinc-900/40 border-zinc-800">
                    <div className="flex items-center gap-3">
                       <div className={cn(
                         "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                         q.completed ? "bg-emerald-500 border-emerald-500" : "border-zinc-700"
                       )}>
                         {q.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                       </div>
                       <div>
                         <p className={cn("text-xs font-bold", q.completed ? "text-zinc-500 line-through" : "text-zinc-300")}>{q.title}</p>
                         <p className="text-[10px] text-amber-500 font-bold">+{q.xp} XP</p>
                       </div>
                    </div>
                    {!q.completed && <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors" />}
                 </div>
               ))}
            </div>

             {/* Recent Achievements */}
             <div className="space-y-4">
               <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                 <Award className="w-5 h-5 text-primary" />
                 Achievements
               </h3>
               <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Smart Saver', icon: '🧠', color: 'primary' },
                    { name: 'Budget Boss', icon: '💰', color: 'emerald-500' },
                    { name: 'Investor I', icon: '📈', color: 'blue-500' },
                    { name: 'Locked', icon: '🔒', color: 'zinc-800', locked: true }
                  ].map((a, i) => (
                    <div key={i} className={cn(
                      "glass-card p-4 flex flex-col items-center justify-center gap-2 text-center bg-zinc-900/40 border-zinc-800",
                      a.locked && "opacity-30 border-dashed"
                    )}>
                       <span className="text-2xl">{a.icon}</span>
                       <p className="text-[10px] font-bold uppercase tracking-tighter text-white">{a.name}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Lesson & Quiz Overlays */}
        <LessonOverlay 
          isOpen={showLesson} 
          onClose={() => setShowLesson(false)} 
          lesson={MOCK_LESSON} 
          onComplete={handleLessonComplete} 
        />

        <AnimatePresence>
          {showQuiz && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            >
              <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl">
                <QuizCard 
                  questions={MOCK_QUIZ_QUESTIONS} 
                  xpReward={activeLevel?.xp || 100}
                  onClose={() => setShowQuiz(false)}
                  onComplete={handleQuizComplete}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
