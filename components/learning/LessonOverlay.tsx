'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, BookOpen, Clock, Zap, Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LessonOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    id: number;
    title: string;
    sections: {
      title: string;
      content: string;
      image?: string;
    }[];
    xpReward: number;
  };
  onComplete: () => void;
}

export default function LessonOverlay({ isOpen, onClose, lesson, onComplete }: LessonOverlayProps) {
  const [currentSection, setCurrentSection] = useState(0);

  const nextSection = () => {
    if (currentSection < lesson.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden flex flex-col h-[85vh] relative shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                   <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-white">{lesson.title}</h2>
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2 Min Read</span>
                     <span className="flex items-center gap-1 text-amber-500"><Zap className="w-3 h-3 fill-amber-500" /> {lesson.xpReward} XP</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-zinc-800 flex">
               {lesson.sections.map((_, i) => (
                 <div 
                   key={i} 
                   className={cn(
                     "h-full flex-1 transition-all duration-500",
                     i <= currentSection ? "bg-primary" : "bg-transparent",
                     i < currentSection && "opacity-50"
                   )} 
                 />
               ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
               <motion.div
                 key={currentSection}
                 initial={{ x: 20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 className="max-w-2xl mx-auto space-y-8"
               >
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                    {lesson.sections[currentSection].title}
                  </h3>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-zinc-400 leading-relaxed font-medium">
                      {lesson.sections[currentSection].content}
                    </p>
                  </div>

                  {lesson.sections[currentSection].image && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950">
                       <img 
                        src={lesson.sections[currentSection].image} 
                        alt="Lesson visual"
                        className="object-cover w-full h-full opacity-80"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                    </div>
                  )}

                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                     <Star className="w-6 h-6 text-primary shrink-0 mt-1 fill-primary/20" />
                     <p className="text-sm font-bold text-primary italic leading-tight">
                        Pro-tip: Master this micro-lesson to unlock the next level and earn a badge!
                     </p>
                  </div>
               </motion.div>
            </div>

            {/* Footer Navigation */}
            <div className="p-6 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50">
               <button 
                 onClick={prevSection}
                 disabled={currentSection === 0}
                 className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-zinc-500 hover:text-white disabled:opacity-0 transition-all"
               >
                 <ChevronLeft className="w-5 h-5" />
                 Previous
               </button>

               <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                 Step {currentSection + 1} of {lesson.sections.length}
               </div>

               <button 
                 onClick={nextSection}
                 className="flex items-center gap-2 px-8 py-3 bg-primary text-black rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
               >
                 {currentSection === lesson.sections.length - 1 ? 'Start Quiz' : 'Next Step'}
                 <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
