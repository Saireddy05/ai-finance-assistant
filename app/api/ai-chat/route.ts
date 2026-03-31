import { NextResponse } from 'next/server';
import { chatWithAssistant } from '@/lib/ai';
import { createClient } from '@/lib/supabase-server';
import { getIndex } from '@/lib/pinecone';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const supabase = createClient();
  const apiKey = process.env.OPENAI_API_KEY;
  
  try {
    // Standardize JSON parsing
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid or missing JSON body' }, { status: 400 });
    }

    const { query, conversationId, context: manualContext } = body;
    
    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Ensure conversation exists and check if it's new
    let isNewConversation = false;
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      // Create it if it doesn't exist
      await (supabase.from('conversations') as any).insert([{
        id: conversationId,
        user_id: user.id,
        title: 'New Chat'
      }]);
      isNewConversation = true;
    }

    // 2. Save user message
    await (supabase.from('ai_messages') as any).insert([{
      user_id: user.id,
      conversation_id: conversationId,
      role: 'user',
      content: query
    }]);

    // 3. Generate summarized title if it's the first message
    if (isNewConversation) {
      try {
        const { generateChatTitle } = await import('@/lib/ai');
        const title = await generateChatTitle(query);
        await (supabase.from('conversations') as any)
          .update({ title })
          .eq('id', conversationId);
      } catch (err) {
        console.error('Title generation failed:', err);
      }
    }

    // 2. FETCH DATA & ANALYZE (Mandatory Context)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('currency')
      .eq('id', user.id)
      .single();
    
    const profile = profileData as any;
    const userCurrency = profile?.currency || 'USD';

    const { data: transactionsData } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);
    
    const transactions = (transactionsData as any[]) || [];

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : '0';

    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});
    
    const topCategory = Object.keys(categorySpending).reduce((a, b) => categorySpending[a] > categorySpending[b] ? a : b, 'None');

    const { getCurrencySymbol } = await import('@/lib/currency');
    const symbol = getCurrencySymbol(userCurrency);

    const financialSummary = `
      - Total Income: ${symbol}${totalIncome}
      - Total Expenses: ${symbol}${totalExpenses}
      - Savings: ${symbol}${savings}
      - Savings Rate: ${savingsRate}%
      - Top Category: ${topCategory} (${symbol}${categorySpending[topCategory] || 0})
    `;

    // 3. FETCH CHAT MEMORY (Last 5 messages)
    const { data: historyData } = await (supabase.from('ai_messages') as any)
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(5);

    const history = (historyData || [])
      .reverse()
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    // 4. SMART TRIGGER
    const isAnalysisRequested = /analyze|report|spending|savings|budget/i.test(query);
    
    let aiResponse;
    if (isAnalysisRequested) {
      const { analyzeFinances } = await import('@/lib/ai');
      aiResponse = await analyzeFinances(query, financialSummary, history);
    } else {
      const { chatWithAssistant } = await import('@/lib/ai');
      const context = `
        ${manualContext || ''}
        
        User Financial Data:
        ${financialSummary}
        
        Previous Context:
        ${history}
      `;
      aiResponse = await chatWithAssistant(query, context);
      // Append disclaimer if not present
      if (!aiResponse?.includes('professional financial advice')) {
        aiResponse += '\n\nThis is AI-generated financial guidance and not professional financial advice.';
      }
    }
    
    // 5. Save AI message
    await (supabase.from('ai_messages') as any).insert([{
      user_id: user.id,
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse
    }]);
    
    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
