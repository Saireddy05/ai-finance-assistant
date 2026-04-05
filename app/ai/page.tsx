'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useChat } from '@/hooks/useChat';
import { useProfile } from '@/hooks/useProfile';
import { Send, Bot, User, Loader2, Sparkles, Plus, MessageSquare, Mic, MicOff, Trash2, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
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
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* 1. Global Navigation Pane */}
      <Sidebar />

      {/* 2. Main Workspace (Header + Chat Content) */}
      <div className="flex-1 ml-64 flex flex-col min-w-0 bg-zinc-950">
        
        {/* Fixed Header */}
        <Header className="shrink-0" />

        {/* Dual Chat Panes */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Mobile History Toggle Overlay */}
          {isHistoryOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm"
              onClick={() => setIsHistoryOpen(false)}
            />
          )}

          {/* Pane A: Chat History (Independent Scroll) */}
          <aside className={cn(
            "fixed inset-y-0 left-64 z-[48] w-72 bg-zinc-900/50 border-r border-zinc-800 transition-transform duration-300 transform lg:relative lg:left-0 lg:translate-x-0 flex flex-col h-full bg-black/20 backdrop-blur-md shrink-0",
            isHistoryOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="p-4 border-b border-zinc-800 shrink-0">
              <button 
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 bg-primary text-black font-extrabold py-3 rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-primary/10 text-sm tracking-tight"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-3 mb-4 mt-2">Chat History</h3>
              {conversations.length === 0 && (
                <p className="px-3 py-8 text-[11px] text-zinc-600 text-center italic">No recent chats</p>
              )}
              {conversations.map((convo: any) => (
                <div
                  key={convo.id}
                  className={cn(
                    "group w-full flex items-center gap-3 px-3 py-3 text-xs rounded-xl transition-all border",
                    currentConversationId === convo.id 
                      ? "bg-zinc-800/80 text-white border-zinc-700/50 shadow-lg" 
                      : "text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300 border-transparent"
                  )}
                >
                  <button
                    onClick={() => {
                      selectConversation(convo.id);
                      setIsHistoryOpen(false);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <MessageSquare className={cn("w-4 h-4 shrink-0", currentConversationId === convo.id ? "text-primary" : "text-zinc-700")} />
                    <span className="truncate font-bold">{convo.label}</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id); }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </aside>

          {/* Pane B: Main Message Area */}
          <main className="flex-1 flex flex-col min-w-0 relative h-full">
            
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden sticky top-0 z-[40] bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
               <button 
                 onClick={() => setIsHistoryOpen(true)}
                 className="p-2 bg-zinc-900 rounded-lg text-zinc-400"
               >
                  <Menu className="w-6 h-6" />
               </button>
               <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">
                  Finova AI
               </span>
            </div>

            {/* Chat Thread (Scrolls independently) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-zinc-950/20">
               {loading && !messages.length ? (
                 <div className="h-full flex items-center justify-center">
                   <div className="relative">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <Sparkles className="w-4 h-4 text-primary absolute inset-0 m-auto animate-pulse" />
                   </div>
                 </div>
               ) : messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20">
                   <div className="w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border border-zinc-800 shadow-2xl relative overflow-hidden group rotate-3">
                     <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                     <Bot className="w-12 h-12 text-primary relative z-10 -rotate-3" />
                   </div>
                   <div>
                     <h3 className="font-bold text-2xl text-white mb-3">How can I help you today?</h3>
                     <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed font-medium">
                       Ask about spending trends, investment tips, or let me analyze your recent financial data.
                     </p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                     {[
                       "What's my biggest expense category?",
                       "How can I optimize my savings?",
                       "Suggest a budget for next month",
                       "Analyze my spending over the last 30 days"
                     ].map((tip: string) => (
                       <button 
                         key={tip}
                         onClick={() => setInput(tip)}
                         className="text-xs font-bold text-zinc-400 p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-primary/50 hover:text-primary transition-all text-left group flex items-center justify-between"
                       >
                         {tip}
                         <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </button>
                     ))}
                   </div>
                 </div>
               ) : (
                 <div className="max-w-4xl mx-auto w-full space-y-8 pb-10">
                   {messages.map((m: any) => (
                     <div 
                       key={m.id} 
                       className={cn(
                         "flex gap-5 group animate-in fade-in slide-in-from-bottom-2 duration-500",
                         m.role === 'user' ? "flex-row-reverse" : "flex-row"
                       )}
                     >
                       <div className={cn(
                         "w-10 h-10 rounded-[1rem] flex items-center justify-center shrink-0 border mt-1 shadow-2xl p-2",
                         m.role === 'user' 
                           ? "bg-primary border-primary shadow-primary/10 text-black" 
                           : "bg-zinc-900 border-zinc-800 text-primary"
                       )}>
                         {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                       </div>
                       <div className={cn(
                         "max-w-[80%] p-6 rounded-3xl text-[14px] leading-relaxed relative font-medium",
                         m.role === 'user' 
                           ? "bg-zinc-800 text-white rounded-tr-none shadow-xl" 
                           : "bg-zinc-900/80 border border-zinc-800/50 text-zinc-300 rounded-tl-none shadow-2xl"
                       )}>
                         {m.content}
                       </div>
                     </div>
                   ))}
                   {sending && (
                     <div className="flex gap-5 animate-pulse">
                       <div className="w-10 h-10 rounded-[1rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center mt-1 p-2">
                         <Bot className="w-5 h-5 text-primary" />
                       </div>
                       <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl rounded-tl-none shadow-xl flex items-center gap-3">
                         <div className="flex gap-1.5 items-center">
                           <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                           <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                           <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                         </div>
                         <span className="text-xs text-zinc-500 font-bold tracking-tight ml-2">Finova is thinking...</span>
                       </div>
                     </div>
                   )}
                   <div ref={messagesEndRef} />
                 </div>
               )}
            </div>

            {/* Fixed Input Area (Pinned to bottom of Main area) */}
            <div className="p-6 border-t border-zinc-900 bg-zinc-950 shrink-0">
               <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={profile?.full_name ? `Ask me anything, ${profile.full_name.split(' ')[0]}...` : "Type your message..."}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] pl-6 pr-28 py-5 text-sm text-white focus:outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-600 shadow-2xl"
                      disabled={sending}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={cn(
                          "p-2.5 rounded-2xl transition-all active:scale-95",
                          isListening ? "bg-rose-500/10 text-rose-500 animate-pulse border border-rose-500/20" : "text-zinc-600 hover:text-white hover:bg-zinc-800"
                        )}
                        title="Voice Input"
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                      <button 
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="p-3 bg-primary text-black rounded-[1.2rem] disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all active:scale-90 group/btn"
                      >
                        <Send className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] text-zinc-600 text-center font-bold uppercase tracking-[0.15em] leading-tight flex items-center justify-center gap-2">
                    <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
                    Risk Factor: AI-generated guidance. Not professional financial advice.
                    <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
                  </p>
               </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
