import { NextResponse } from 'next/server';
import { getPersonalizedInsights } from '@/lib/personalization-engine';
import { createClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { profile, transactionsSummary } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: 'Profile is required' }, { status: 400 });
    }

    const recommendations = await getPersonalizedInsights(profile, transactionsSummary || '');
    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error('Recommendations API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
