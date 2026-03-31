'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Zap, Trophy, ArrowRight, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface QuizProps {
  questions: {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  xpReward: number;
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

export default function QuizCard({ questions, xpReward, onComplete, onClose }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentQuestion].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const isCorrect = selectedOption === questions[currentQuestion].correctIndex;

  if (showResult) {
    const passed = score >= Math.ceil(questions.length * 0.7);
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center text-center p-8 space-y-6"
      >
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-700",
          passed ? "bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)]" : "bg-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.4)]"
        )}>
          {passed ? <Trophy className="w-12 h-12 text-white" /> : <RefreshCcw className="w-12 h-12 text-white" />}
        </div>
        
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
            {passed ? 'Level Mastered!' : 'Try Again'}
          </h2>
          <p className="text-zinc-500 max-w-xs mx-auto">
            {passed 
              ? `You answered ${score}/${questions.length} correctly and earned some serious XP!`
              : `You only got ${score}/${questions.length} right. Review the lesson and fly higher!`}
          </p>
        </div>

        <div className="flex gap-4 w-full max-w-xs pt-4">
           {passed ? (
             <button 
               onClick={() => onComplete(true)}
               className="flex-1 py-4 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
             >
               CLAIM {xpReward} XP
             </button>
           ) : (
             <>
               <button 
                 onClick={onClose}
                 className="flex-1 py-4 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-700 transition-all"
               >
                 Review
               </button>
               <button 
                 onClick={() => {
                   setShowResult(false);
                   setCurrentQuestion(0);
                   setSelectedOption(null);
                   setIsAnswered(false);
                   setScore(0);
                 }}
                 className="flex-1 py-4 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all"
               >
                 Retry
               </button>
             </>
           )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900 overflow-hidden">
      <div className="p-8 md:p-12 flex-1 overflow-y-auto">
        <motion.div
          key={currentQuestion}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-10"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Question {currentQuestion + 1}/{questions.length}</span>
            <h3 className="text-2xl font-bold text-white leading-tight">
              {questions[currentQuestion].question}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {questions[currentQuestion].options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(i)}
                disabled={isAnswered}
                className={cn(
                  "w-full p-5 rounded-2xl text-left font-bold text-sm transition-all relative overflow-hidden group border-2",
                  !isAnswered && "border-zinc-800 bg-zinc-900 hover:border-primary/50 hover:bg-zinc-800/50",
                  isAnswered && i === questions[currentQuestion].correctIndex && "border-emerald-500 bg-emerald-500/10 text-emerald-500",
                  isAnswered && selectedOption === i && i !== questions[currentQuestion].correctIndex && "border-rose-500 bg-rose-500/10 text-rose-500",
                  isAnswered && selectedOption !== i && i !== questions[currentQuestion].correctIndex && "border-zinc-800 opacity-40 grayscale"
                )}
              >
                <div className="flex items-center justify-between relative z-10">
                  <span>{option}</span>
                  {isAnswered && i === questions[currentQuestion].correctIndex && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {isAnswered && selectedOption === i && i !== questions[currentQuestion].correctIndex && <XCircle className="w-5 h-5 text-rose-500" />}
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                  "p-6 rounded-3xl border-2",
                  isCorrect ? "bg-emerald-500/5 border-emerald-500/10" : "bg-rose-500/5 border-rose-500/10"
                )}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Explanation</p>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  {questions[currentQuestion].explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="p-8 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-black rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-0 disabled:pointer-events-none"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Challenge' : 'Next Question'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
