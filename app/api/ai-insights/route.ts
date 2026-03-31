import { NextResponse } from 'next/server';
import { generateFinancialInsights } from '@/lib/ai';
import { createClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid or missing JSON body' }, { status: 400 });
    }

    const { summary } = body;
    if (!summary) {
      return NextResponse.json({ error: 'summary is required' }, { status: 400 });
    }

    const insights = await generateFinancialInsights(summary);
    return NextResponse.json(insights);
  } catch (error: any) {
    console.error('AI Insights Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
