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
export async function generateDataDrivenInsights(summary: string, signals: string[]) {
  const openrouter = getOpenRouterClient();
  const response = await openrouter.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      {
        role: 'system',
        content: `You are a smart financial advisor. I will provide you with a financial summary and a list of detected patterns (signals).
        Your task is to explain these insights in simple, human-friendly language and provide actionable suggestions.
        
        RULES:
        1. Keep it concise and practical.
        2. Use a professional yet encouraging tone.
        3. For each insight, provide a 'type' (warning, info, or success).
        4. Include a mandatory disclaimer at the end of EACH suggestion if appropriate, or once at the bottom.
        
        RETURN FORMAT (JSON ARRAY):
        [
          {
            "type": "warning|info|success",
            "title": "Short Title",
            "description": "Clear explanation of the data.",
            "suggestion": "Practical action to take. (Include disclaimer if needed)"
          }
        ]
        
        Disclaimer to include: "This is AI-generated financial guidance and not professional financial advice."`
      },
      {
        role: 'user',
        content: `
        Financial Summary:
        ${summary}
        
        Detected Signals:
        ${signals.join('\n- ')}
        `
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  try {
    const parsed = JSON.parse(content || '[]');
    // OpenRouter/Gemini might wrap it in an object like { "insights": [...] } or return the array directly.
    return Array.isArray(parsed) ? parsed : (parsed.insights || parsed.data || []);
  } catch (e) {
    return [];
  }
}
