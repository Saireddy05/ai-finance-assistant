import OpenAI from 'openai';

function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is missing from environment variables');
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'https://finova-ai.vercel.app',
      'X-Title': 'Finova AI Finance',
    },
  });
}

export async function generateFinancialInsights(summary: string) {
  const openrouter = getOpenRouterClient();
  const response = await openrouter.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: `You are an elite financial advisor. Analyze the following financial summary and provide 3-5 high-impact, actionable insights. 
        Focus on:
        1. Unusual spending patterns.
        2. Potential savings opportunities.
        3. Budget optimization.
        4. Investment/Debt management suggestions.
        
        Return your response in JSON format:
        {
          "insights": [
            { "title": "...", "description": "...", "type": "warning|info|success" }
          ]
        }`
      },
      {
        role: 'user',
        content: summary
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || '{"insights": []}');
}

export async function chatWithAssistant(query: string, context: string) {
  const openrouter = getOpenRouterClient();
  const response = await openrouter.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: `You are Finova AI, a premium AI financial assistant. Use the provided financial context to answer the user's query accurately and professionally.
        
        Context:
        ${context}
        
        Keep your advice practical, data-driven, and supportive. If you don't have enough data to answer, be honest and ask for clarification.`
      },
      {
        role: 'user',
        content: query
      }
    ]
  });

  return response.choices[0].message.content;
}
export async function generateChatTitle(firstMessage: string) {
  const openrouter = getOpenRouterClient();
  const response = await openrouter.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: `Summarize the following user message into a 3-5 word title for a chat conversation. 
        Focus on the main topic. Do not use quotes or periods. Return only the title.`
      },
      {
        role: 'user',
        content: firstMessage
      }
    ]
  });

  return response.choices[0].message.content?.trim() || 'New Chat';
}
export async function analyzeFinances(query: string, summary: string, history: string) {
  const openrouter = getOpenRouterClient();
  const response = await openrouter.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: `You are an expert practical financial advisor. Analyze the user's financial data and provide clear, actionable advice.
        
        RESPONSE FORMAT:
        Health Score: X/10
        
        Problem:
        - [Identify a key problem]
        
        Recommendations:
        1. [Actionable advice 1]
        2. [Actionable advice 2]
        3. [Actionable advice 3]
        
        Always append: "This is AI-generated financial guidance and not professional financial advice."`
      },
      {
        role: 'user',
        content: `
        User Message: ${query}
        
        Financial Summary:
        ${summary}
        
        Recent History:
        ${history}
        `
      }
    ]
  });

  return response.choices[0].message.content;
}
/**
 * Generates data-driven financial insights using an LLM.
 * Parses the response reliably into a structured array of suggestions.
 */
export async function generateDataDrivenInsights(summary: string, signals: string[]) {
  const openrouter = getOpenRouterClient();
  const response = await openrouter.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: `You are a smart financial advisor. Analyze the summary and detected signals.
        
        RETURN FORMAT (JSON ARRAY):
        [
          {
            "type": "warning|info|success",
            "title": "Short Title",
            "description": "Explanation.",
            "suggestion": "Actionable advice. (Include disclaimer: 'This is AI-generated financial guidance and not professional financial advice.')"
          }
        ]`
      },
      {
        role: 'user',
        content: `Summary: ${summary}\nSignals: ${signals.join(', ')}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content || '[]';
  try {
    const parsed = JSON.parse(content);
    // Support both direct arrays and wrapped objects { insights: [...] }
    const insights = Array.isArray(parsed) ? parsed : (parsed.insights || parsed.data || []);
    return Array.isArray(insights) ? insights : [];
  } catch (error) {
    console.error('Failed to parse AI insights JSON:', error);
    return [];
  }
}

export async function generateAINotification(signal: any) {
  const openrouter = getOpenRouterClient();
  const response = await openrouter.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: `You are Finova AI, a friendly financial coach. I will provide a 'signal' about user spending (e.g. spike, habit, budget, savings).
        Write a 3-5 word Title and a 1-sentence friendly, actionable notification message.
        
        TONE: Human, helpful, supportive, NOT robotic.
        
        RETURN FORMAT (JSON):
        {
          "title": "Short Title",
          "message": "Friendly, actionable message.",
          "type": "info|warning|success"
        }
        
        Example for Budget:
        { "title": "Coffee Budget Alert", "message": "You're 90% through your coffee budget! Maybe brew at home tomorrow?", "type": "warning" }`
      },
      {
        role: 'user',
        content: `Signal: ${JSON.stringify(signal)}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  try {
    const parsed = JSON.parse(content || '{}');
    return {
      title: parsed.title || "Financial Insight",
      message: parsed.message || "Check your dashboard for updates.",
      type: (parsed.type === 'warning' || parsed.type === 'success' || parsed.type === 'info') ? parsed.type : "info"
    };
  } catch (e) {
    return { title: "Financial Update", message: "We've detected a move in your finances. Check your transactions.", type: "info" };
  }
}

/**
 * Generates a concise, financially-focused AI summary for a news article.
 */
export async function generateNewsSummary(title: string, description?: string) {
  const openrouter = getOpenRouterClient();
  const response = await openrouter.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: `You are an expert global financial analyst. Summarize this news in exactly 2 lines.
        Focus ONLY on its direct impact on stock markets, commodities (like Gold/Silver), or the global/country economy.
        Keep it simple, actionable, and data-driven.
        Do not use markdown. Return only the summary text.`
      },
      {
        role: 'user',
        content: `Title: ${title}\nDescription: ${description || 'Not available'}`
      }
    ]
  });

  return response.choices[0].message.content?.trim() || 'No summary available.';
}

/**
 * Generates hyper-personalized financial advice based on the user's profile and data.
 */
export async function generatePersonalizedAdvice(profile: any, summary: string) {
  const openrouter = getOpenRouterClient();
  const response = await openrouter.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: `You are an elite personal financial advisor. Use the user's profile and spending summary to provide 3 hyper-specific, actionable recommendations.
        
        Profile Context:
        ${JSON.stringify(profile)}
        
        RETURN FORMAT (JSON ARRAY):
        [
          {
            "title": "Short Title",
            "description": "2-sentence clear actionable advice.",
            "icon": "LucideIconName (one of: Target, TrendingUp, Shield, Wallet, Briefcase, ShieldCheck)",
            "actionLabel": "2-3 word CTA e.g. 'Set a Budget', 'View Analytics', 'Add Transaction', 'Start Learning'",
            "actionUrl": "One of: /budgets | /analytics | /transactions | /learning | /ai"
          }
        ]`
      },
      {
        role: 'user',
        content: `Spending Summary for the Month: ${summary}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content || '[]';
  try {
    const parsed = JSON.parse(content);
    const recommendations = parsed.recommendations || parsed.data || parsed;
    return Array.isArray(recommendations) ? recommendations : [];
  } catch (error) {
    console.error('Failed to parse AI advice JSON:', error);
    return [];
  }
}
