import { NextResponse } from 'next/server';
import { generateAINotification } from '@/lib/ai';
import { createClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { signal, userId } = await req.json();
    
    if (!signal || !userId) {
      return NextResponse.json({ error: 'Signal and userId are required' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Server-side Rate Limiting: Check if any notification was created in the last 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
    const { data: recentNotifs } = await (supabase as any)
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .gt('created_at', thirtySecondsAgo)
      .limit(1);

    if (recentNotifs && recentNotifs.length > 0) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Please wait 30 seconds between AI generations.',
        skipped: true 
      }, { status: 429 });
    }

    const aiResponse = await generateAINotification(signal);
    return NextResponse.json(aiResponse);
  } catch (error: any) {
    console.error('AI Notification Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
