'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { Newspaper, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to load market news');
      const data = await response.json();
      setNews(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-w-0 bg-zinc-950">
        <Header className="shrink-0" />

        <main className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-zinc-900">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Newspaper className="w-8 h-8 text-primary" />
                </div>
                <div>
                   <h1 className="text-3xl font-black text-white tracking-tight">Global Markets & Commodities</h1>
                   <p className="text-zinc-500 text-sm font-bold flex items-center gap-2">
                     Stock market, gold, silver & world finance insights by <span className="text-primary">Finova AI</span>
                   </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={fetchNews}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-black text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Refresh Feed
            </button>
          </div>

          {/* News Feed Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card h-[450px] animate-pulse border-zinc-900/50">
                   <div className="h-44 w-full bg-zinc-900 rounded-t-xl mb-4" />
                   <div className="p-5 space-y-4">
                      <div className="h-4 w-1/4 bg-zinc-900 rounded" />
                      <div className="h-8 w-full bg-zinc-900 rounded" />
                      <div className="h-20 w-full bg-zinc-900/50 rounded-2xl" />
                      <div className="h-10 w-full bg-zinc-900 rounded-xl mt-auto" />
                   </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-20 glass-card bg-rose-500/5 border-rose-500/20">
               <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
               <h3 className="text-lg font-bold text-white mb-2">Failed to sync feed</h3>
               <p className="text-sm text-zinc-500 mb-6">{error}</p>
               <button 
                 onClick={fetchNews}
                 className="px-8 py-3 bg-rose-500 text-white rounded-xl font-bold text-sm tracking-tight hover:opacity-90 active:scale-95 transition-all"
               >
                 Try Again
               </button>
            </div>
          ) : news.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 glass-card">
               <Newspaper className="w-12 h-12 text-zinc-800 mb-4" />
               <h3 className="text-lg font-bold text-white mb-2">No relevant market news available right now.</h3>
               <p className="text-sm text-zinc-500">Check back later for global finance and commodity insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
              {news.map((story, i) => (
                <NewsCard key={i} story={story} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
