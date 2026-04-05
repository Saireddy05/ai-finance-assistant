'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Lightbulb,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import TopicQuiz from './TopicQuiz';

interface TopicBodyProps {
  lesson: any;
  isCompleted: boolean;
  onComplete: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function TopicBody({ 
  lesson, 
  isCompleted, 
  onComplete, 
  onNext, 
  onPrev,
  hasPrev,
  hasNext 
}: TopicBodyProps) {

  if (!lesson) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-12">
      {/* Article Header */}
      <header className="mb-12 space-y-6">
        <div className="flex items-center justify-between text-zinc-500 font-medium text-sm">
           <div className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold text-primary">
             Finance Fundamentals
           </div>
           <div className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors cursor-default">
             <Clock className="w-3.5 h-3.5" /> 5 min read
           </div>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
          {lesson.title}
        </h1>

        <p className="text-xl md:text-2xl text-zinc-400 italic leading-relaxed font-serif border-l-4 border-zinc-800 pl-6 py-2">
          "{lesson.introduction}"
        </p>
      </header>

      {/* Main Content */}
      <article className="prose prose-invert prose-zinc max-w-none space-y-12">
        {lesson.fullContent.map((section: any, index: number) => (
          <section key={index} className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
              {section.heading}
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed font-medium">
              {section.text}
            </p>
          </section>
        ))}

        {/* Key Points Summary */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 my-16">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
             </div>
             <h3 className="text-xl font-bold text-white">Summary of Key Points</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0">
             {lesson.keyPoints.map((point: string, i: number) => (
               <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                  {point}
               </li>
             ))}
          </ul>
        </section>

        {/* Examples Section */}
        {lesson.examples && lesson.examples.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
               </div>
               <h3 className="text-2xl font-bold text-white">Real-world Examples</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
               {lesson.examples.map((ex: any, i: number) => (
                 <div key={i} className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3 hover:border-zinc-700 transition-colors group">
                    <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{ex.title}</h4>
                    <p className="text-zinc-400 leading-relaxed text-sm">{ex.description}</p>
                 </div>
               ))}
            </div>
          </section>
        )}

        {/* Did You Know? */}
        {lesson.didYouKnow && (
          <div className="flex items-start gap-6 p-8 bg-primary/5 rounded-3xl border border-primary/20 my-16">
             <div className="p-3 bg-primary/10 rounded-2xl shrink-0">
                <HelpCircle className="w-6 h-6 text-primary" />
             </div>
             <div className="space-y-2">
                <p className="font-black text-[10px] text-primary uppercase tracking-[0.2em]">Did you know?</p>
                <p className="text-zinc-300 leading-relaxed italic text-lg">{lesson.didYouKnow}</p>
             </div>
          </div>
        )}

        {/* Further Reading Section (Wikipedia) */}
        {lesson.wikipediaLinks && lesson.wikipediaLinks.length > 0 && (
          <section className="space-y-6 pt-12 border-t border-zinc-900">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                   <ExternalLink className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">Further Reading</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.wikipediaLinks.map((link: any, i: number) => (
                  <a 
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                  >
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Wikipedia</p>
                       <p className="font-bold text-white group-hover:text-blue-500 transition-colors">{link.title}</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
             </div>
             <p className="text-center text-[10px] text-zinc-600 uppercase font-bold tracking-widest mt-4">
               Deepen your understanding with community-verified knowledge
             </p>
          </section>
        )}

        {/* Quiz Section */}
        <section className="pt-24 border-t border-zinc-900" id="quiz">
           <div className="mb-12 text-center">
              <h3 className="text-3xl font-black text-white mb-4">Check Your Knowledge</h3>
              <p className="text-zinc-500 max-w-sm mx-auto text-sm">
                Take a quick self-check to ensure you've understood the key concepts of this topic.
              </p>
           </div>
           
           <div className="max-w-2xl mx-auto">
              <TopicQuiz 
                lessonId={lesson.id}
                questions={lesson.quiz} 
                onComplete={onComplete}
              />
           </div>
        </section>

        {/* Financial Disclaimer */}
        <div className="flex items-start gap-4 p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800 mt-24">
           <AlertCircle className="w-5 h-5 shrink-0 text-zinc-600" />
           <div className="space-y-1">
              <p className="font-bold text-zinc-400 uppercase tracking-widest text-[9px]">Financial Disclaimer</p>
              <p className="text-zinc-600 text-[10px] leading-relaxed">
                This content is for educational purposes only and not financial advice. 
                Investments involve market risk. Past performance does not guarantee future results. 
                Always consult with a SEBI registered professional advisor before making any investment decisions.
              </p>
           </div>
        </div>
      </article>

      {/* Footer Navigation */}
      <footer className="mt-24 pt-12 border-t border-zinc-900 flex items-center justify-between">
         <button 
           onClick={onPrev}
           disabled={!hasPrev}
           className="flex items-center gap-3 px-6 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all disabled:opacity-0 disabled:pointer-events-none group"
         >
           <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
           <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Previous</p>
              <p className="font-bold text-sm">Earlier Topic</p>
           </div>
         </button>

         <button 
           onClick={onNext}
           disabled={!hasNext}
           className="flex items-center gap-3 px-6 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all disabled:opacity-0 disabled:pointer-events-none text-right group ml-auto"
         >
           <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Up Next</p>
              <p className="font-bold text-sm">Coming Lesson</p>
           </div>
           <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
         </button>
      </footer>
    </div>
  );
}
