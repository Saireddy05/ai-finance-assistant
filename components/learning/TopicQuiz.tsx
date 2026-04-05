'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface QuizProps {
  lessonId: number;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  onComplete: () => void;
}

export default function TopicQuiz({ lessonId, questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Reset quiz when lessonId changes
  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  }, [lessonId]);

  const safeQuestion = questions[currentQuestion] || questions[0];

  const handleOptionSelect = (index: number) => {
    if (isAnswered || !safeQuestion) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === safeQuestion.correctIndex) {
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
      onComplete(); // Mark as complete in the parent
    }
  };

  const isCorrect = safeQuestion ? selectedOption === safeQuestion.correctIndex : false;

  if (showResult || !safeQuestion) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center p-12 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-6"
      >
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
           <Check className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Topic Knowledge Checked</h2>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto">
             Great job! You've successfully completed the self-check for this topic.
          </p>
        </div>

        <button 
          onClick={() => {
            setShowResult(false);
            setCurrentQuestion(0);
            setSelectedOption(null);
            setIsAnswered(false);
            setScore(0);
          }}
          className="flex items-center gap-2 px-8 py-3 bg-zinc-800 text-white rounded-2xl font-bold text-sm hover:bg-zinc-700 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" /> Restart Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between text-[10px] font-black tracking-[0.2em] uppercase">
          <span className="text-primary">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-zinc-500">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
        </div>

        <h3 className="text-xl font-bold text-white leading-tight">
          {safeQuestion.question}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {safeQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(i)}
              disabled={isAnswered}
              className={cn(
                "w-full p-6 rounded-2xl text-left font-bold text-sm transition-all border-2 relative overflow-hidden group",
                !isAnswered && "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800",
                isAnswered && i === safeQuestion.correctIndex && "border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
                isAnswered && selectedOption === i && i !== safeQuestion.correctIndex && "border-rose-500 bg-rose-500/10 text-rose-500",
                isAnswered && selectedOption !== i && i !== safeQuestion.correctIndex && "border-zinc-900 opacity-40"
              )}
            >
              <div className="flex items-center justify-between relative z-10">
                <span>{option}</span>
                {isAnswered && i === safeQuestion.correctIndex && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                )}
                {isAnswered && selectedOption === i && i !== safeQuestion.correctIndex && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                     <XCircle className="w-5 h-5 text-rose-500" />
                  </motion.div>
                )}
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
                "p-8 rounded-3xl border-2",
                isCorrect ? "bg-emerald-500/5 border-emerald-500/10" : "bg-rose-500/5 border-rose-500/10"
              )}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-50 flex items-center gap-2">
                 <Lightbulb className="w-3.5 h-3.5" /> Explanation
              </p>
              <p className="text-zinc-300 text-sm font-medium leading-relaxed">
                {safeQuestion.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className="flex items-center gap-2 px-10 py-4 bg-primary text-black rounded-2xl font-black text-sm hover:translate-x-1 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-0 disabled:pointer-events-none"
        >
          {currentQuestion === questions.length - 1 ? 'Complete Topic' : 'Next Question'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Lightbulb(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.7 1.3 1.5 1.5 2.4" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
