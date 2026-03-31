'use client';

import AppLayout from '@/components/AppLayout';
import { useChat } from '@/hooks/useChat';
import { useProfile } from '@/hooks/useProfile';
import { Send, Bot, User, Loader2, Sparkles, Plus, MessageSquare, Mic, MicOff, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const SCROLLBAR_STYLE = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3f3f46;
  }
`;

export default function AIChatPage() {
  const { profile } = useProfile();
  const { 
    messages, 
    conversations, 
    currentConversationId,
    loading, 
    sending, 
    sendMessage, 
    startNewChat, 
    selectConversation,
    deleteConversation
  } = useChat();
  
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // Voice Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error:', event.error);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    
    try {
      await sendMessage(userMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <AppLayout>
      <style>{SCROLLBAR_STYLE}</style>
      <div className="max-w-6xl mx-auto h-[calc(100vh-10rem)] flex gap-6 overflow-hidden">
        {/* Sidebar - History */}
        <div className="w-64 glass-card shrink-0 flex flex-col hidden md:flex border border-zinc-800">
          <div className="p-4 border-b border-zinc-800">
            <button 
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2 mt-4">History</h3>
            {conversations.map((convo: any) => (
              <div
                key={convo.id}
                className={cn(
                  "group w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-all",
                  currentConversationId === convo.id 
                    ? "bg-zinc-800 text-primary border border-primary/20" 
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <button
                  onClick={() => selectConversation(convo.id)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{convo.label}</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id); }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 hover:text-rose-400 transition-all"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 glass-card overflow-hidden flex flex-col border border-zinc-800">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Finova AI</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-zinc-500 font-medium">Online • Personal Advisor</span>
                </div>
              </div>
            </div>
            <button 
              onClick={startNewChat}
              className="md:hidden p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-950/30">
            {loading && !messages.length ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                  <Bot className="w-10 h-10 text-primary relative z-10" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">How can I help you today?</h3>
                  <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
                    Ask about spending trends, budget advice, or let me analyze your recent transactions.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                  {[
                    "What's my biggest expense?",
                    "How's my savings rate?",
                    "Budget optimization tips",
                    "Analyze my last 30 days"
                  ].map((tip: string) => (
                    <button 
                      key={tip}
                      onClick={() => setInput(tip)}
                      className="text-[11px] text-zinc-400 p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-primary/50 hover:text-primary transition-all text-left"
                    >
                      {tip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m: any) => (
                <div 
                  key={m.id} 
                  className={cn(
                    "flex gap-4 group",
                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-1",
                    m.role === 'user' ? "bg-primary border-primary/50 text-black shadow-lg shadow-primary/20" : "bg-zinc-800 border-zinc-700 text-primary"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] w-fit p-4 rounded-2xl text-[13px] leading-relaxed relative",
                    m.role === 'user' 
                      ? "bg-zinc-800 text-white rounded-tr-none shadow-md" 
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none shadow-xl"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {sending && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none shadow-xl">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce"></span>
                    <span className="text-[10px] text-zinc-500 ml-2 font-medium">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-900/50 shrink-0">
            <div className="relative max-w-4xl mx-auto flex flex-col gap-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={profile?.full_name ? `Ask Finova AI, ${profile.full_name.split(' ')[0]}...` : "Type your message..."}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-4 pr-24 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all placeholder:text-zinc-600 shadow-inner"
                  disabled={sending}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={cn(
                      "p-2 rounded-xl transition-all active:scale-90",
                      isListening ? "bg-rose-500/10 text-rose-500 animate-pulse" : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                    )}
                    title="Voice Input"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button 
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="p-2.5 bg-primary text-black rounded-xl disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all active:scale-90 shadow-lg shadow-primary/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 text-center leading-tight">
                This is AI-generated financial guidance and not professional financial advice.
              </p>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
