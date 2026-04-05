'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Search, 
  CheckCircle2, 
  Circle, 
  Menu, 
  X,
  GraduationCap
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase';
import { INVESTMENT_LESSONS } from '@/lib/lessons';
import TopicBody from '@/components/learning/TopicBody';

export default function LearningPage() {
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchCompletedLessons() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('user_lessons')
          .select('lesson_id')
          .eq('user_id', user.id);
        
        if (error) throw error;
        const completedIds = (data as any[])?.map(d => d.lesson_id) || [];
        setCompletedLessons(completedIds);
        
        const firstUncompleted = Object.keys(INVESTMENT_LESSONS)
          .map(Number)
          .find(id => !completedIds.includes(id));
        
        if (firstUncompleted) {
          setActiveLessonId(firstUncompleted);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoadingProgress(false);
      }
    }

    fetchCompletedLessons();
  }, [user]);

  const lessons = Object.values(INVESTMENT_LESSONS);
  const filteredLessons = lessons.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const progressPercentage = Math.round((completedLessons.length / lessons.length) * 100);

  const handleLessonComplete = async () => {
    if (!user) return;
    
    if (!completedLessons.includes(activeLessonId)) {
      setCompletedLessons(prev => [...prev, activeLessonId]);
    }

    try {
      await (supabase
        .from('user_lessons')
        .upsert({ 
          user_id: user.id, 
          lesson_id: activeLessonId,
          completed_at: new Date().toISOString()
        } as any, { onConflict: 'user_id,lesson_id' }) as any);
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const activeLesson = INVESTMENT_LESSONS[activeLessonId];

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* 1. Global Navigation Pane */}
      <Sidebar />

      {/* 2. Main Workspace (Header + Dual Learning Panes) */}
      <div className="flex-1 ml-64 flex flex-col min-w-0 bg-zinc-950">
        
        {/* Fixed Header */}
        <Header className="shrink-0" />

        {/* Dual Learning Panes */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Mobile Sidebar Toggle Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Pane A: Curriculum Sidebar (Independent Scroll) */}
          <aside className={cn(
            "fixed inset-y-0 left-64 z-[48] w-80 bg-zinc-900/50 border-r border-zinc-800 transition-transform duration-300 transform lg:relative lg:left-0 lg:translate-x-0 p-6 flex flex-col gap-8 h-full bg-black/20 backdrop-blur-md",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-primary" />
                 </div>
                 <h2 className="font-bold text-white text-lg tracking-tight">Curriculum</h2>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Section */}
            <div className="space-y-3 shrink-0">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span>Completed</span>
                  <span>{progressPercentage}%</span>
               </div>
               <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-700"
                    style={{ width: `${progressPercentage}%` }}
                  />
               </div>
            </div>

            {/* Search Bar */}
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                type="text"
                placeholder="Filter topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
              />
            </div>

            {/* Lesson List (Scrolls independently) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 space-y-1 pb-10">
               {filteredLessons.map((lesson) => {
                 const isActive = activeLessonId === lesson.id;
                 const isCompleted = completedLessons.includes(lesson.id);
                 
                 return (
                   <button
                     key={lesson.id}
                     onClick={() => {
                       setActiveLessonId(lesson.id);
                       setIsSidebarOpen(false);
                     }}
                     className={cn(
                       "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all group relative",
                       isActive ? "bg-zinc-800/80 shadow-xl border border-zinc-700/50" : "hover:bg-zinc-900/50 border border-transparent"
                     )}
                   >
                      {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />
                      )}
                      <div className="shrink-0 mt-0.5">
                         {isCompleted ? (
                           <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                         ) : (
                           <Circle className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                         )}
                      </div>
                      <div>
                         <p className={cn(
                           "text-xs font-bold transition-colors leading-tight",
                           isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300",
                           isCompleted && !isActive && "text-zinc-600"
                         )}>
                           {lesson.title}
                         </p>
                         <p className="text-[10px] text-zinc-600 mt-1 uppercase font-bold tracking-widest">
                           {isCompleted ? 'Finished' : '5 min read'}
                         </p>
                      </div>
                   </button>
                 );
               })}
            </div>
          </aside>

          {/* Pane B: Content Area (Independent Scroll) */}
          <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden sticky top-0 z-[40] bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="p-2 bg-zinc-900 rounded-lg text-zinc-400"
               >
                  <Menu className="w-6 h-6" />
               </button>
               <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">
                  Curriculum
               </span>
            </div>

            {/* Reading Experience */}
            <div className="min-h-full">
              {activeLesson ? (
                <TopicBody 
                  key={activeLessonId}
                  lesson={activeLesson}
                  isCompleted={completedLessons.includes(activeLessonId)}
                  onComplete={handleLessonComplete}
                  hasNext={activeLessonId < lessons.length}
                  hasPrev={activeLessonId > 1}
                  onNext={() => setActiveLessonId(prev => Math.min(lessons.length, prev + 1))}
                  onPrev={() => setActiveLessonId(prev => Math.max(1, prev - 1))}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 space-y-6">
                   <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 animate-pulse">
                      <GraduationCap className="w-10 h-10 text-zinc-700" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Select a Topic</h3>
                      <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">
                        Choose a topic from the curriculum to begin your calm learning journey.
                      </p>
                   </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
