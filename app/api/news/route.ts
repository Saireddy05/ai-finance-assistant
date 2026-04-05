import { NextResponse } from 'next/server';
import { generateNewsSummary } from '@/lib/ai';
import { createClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Finnhub API key is missing' }, { status: 500 });
    }

    // 1. Fetch larger batch of news from Finnhub for filtering
    const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch news from Finnhub');
    }

    const newsData = await response.json();
    const supabase = createClient();

    // 2. Global Finance / Market / Commodities Filter Config
    const marketKeywords = [
      'stock', 'market', 'gold', 'silver', 'economy', 'finance', 'invest',
      'wall street', 'dow', 'nasdaq', 'nifty', 'sensex', 'fed', 
      'central bank', 'inflation', 'gdp', 'commodity', 'bonds', 'treasury'
    ];

    // 3. Apply Filtering logic
    const filteredNews = newsData.filter((story: any) => {
      const title = (story.headline || '').toLowerCase();
      const summary = (story.summary || '').toLowerCase();

      const isMarketNews = marketKeywords.some(k => title.includes(k) || summary.includes(k));
      return isMarketNews;
    }).slice(0, 12); // Goal: Top 10-12 filtered global finance articles

    // 4. Hydrate with AI Summaries (using DB Cache)
    const hydratedNews = await Promise.all(filteredNews.map(async (story: any) => {
      try {
        // Check if we already summarized this URL
        const { data: cached } = await (supabase as any)
          .from('news_stories')
          .select('summary')
          .eq('url', story.url)
          .single();

        if (cached?.summary) {
          return { ...story, aiSummary: cached.summary };
        }

        // Generate new AI summary (Global Market/Gold/Silver focus)
        const summary = await generateNewsSummary(story.headline, story.summary);
        
        // Save to cache (Fire and forget)
        (supabase as any).from('news_stories').insert({
          url: story.url,
          title: story.headline,
          source: story.source,
          image: story.image,
          published_at: new Date(story.datetime * 1000).toISOString(),
          summary: summary,
          category: 'global_finance'
        }).then(({ error }: any) => {
           if (error) console.error('Cache Save Error:', error);
        });

        return { ...story, aiSummary: summary };
      } catch (err) {
        console.error('News Hydration Error:', err);
        return { ...story, aiSummary: story.summary || 'Summary unavailable.' };
      }
    }));

    return NextResponse.json(hydratedNews);
  } catch (error: any) {
    console.error('News API Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
