'use client';

import { ExternalLink, Clock, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  story: {
    headline: string;
    source: string;
    image: string;
    url: string;
    datetime: number;
    aiSummary: string;
    category?: string;
  };
}

export default function NewsCard({ story }: NewsCardProps) {
  const publishedDate = new Date(story.datetime * 1000);
  
  const handleReadMore = () => {
    window.open(story.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group relative glass-card p-0 overflow-hidden flex flex-col border border-zinc-900/50 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98]">
      {/* 📸 Article Image */}
      <div className="relative h-44 w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        {story.image ? (
          <img 
            src={story.image} 
            alt={story.headline} 
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-zinc-800" />
          </div>
        )}
        
        {/* Source Badge */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
          <span className="px-3 py-1 bg-primary/90 text-black text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-sm">
            {story.source}
          </span>
        </div>
      </div>

      {/* 📃 Article Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(publishedDate, { addSuffix: true })}
        </div>

        <h3 className="text-sm font-black text-white leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
          {story.headline}
        </h3>

        {/* 🤖 AI Summary */}
        <div className="relative bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-2xl mb-6 group-hover:bg-primary/5 transition-all">
          <div className="absolute -top-2 -left-2 bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-800 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-500">AI Summary</span>
          </div>
          <p className="text-[11px] font-medium text-zinc-400 leading-relaxed italic line-clamp-6 min-h-[100px] group-hover:text-zinc-300">
            "{story.aiSummary}"
          </p>
        </div>

        {/* 🔗 Action Button */}
        <button 
          onClick={handleReadMore}
          className="mt-auto w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-2 group/btn"
        >
          Read Full Article
          <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
