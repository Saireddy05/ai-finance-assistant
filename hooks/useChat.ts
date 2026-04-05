'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

type Message = Database['public']['Tables']['ai_messages']['Row'];

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{id: string, label: string}[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();

  // Initialize a new chat on mount if not provided
  useEffect(() => {
    if (!currentConversationId && !authLoading) {
      setCurrentConversationId(crypto.randomUUID());
    }
  }, [authLoading]);

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const conversationsData = data || [];
      setConversations(conversationsData.map((c: any) => ({
        id: c.id,
        label: c.title
      })));
    } catch (err: any) {
      console.error('Fetch Convos Error:', err.message || err);
    }
  };

  const fetchMessages = async (id: string) => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
      fetchConversations();
    }
  }, [currentConversationId]);

  const sendMessage = async (content: string) => {
    if (!currentConversationId) return;

    // Optimistic Update
    const tempUserMsg = {
      id: crypto.randomUUID(),
      user_id: '', // Will be filled by server
      conversation_id: currentConversationId,
      role: 'user',
      content,
      created_at: new Date().toISOString()
    } as Message;

    setMessages(prev => [...prev, tempUserMsg]);

    try {
      setSending(true);
      setError(null);

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: content,
          conversationId: currentConversationId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const result = await response.json();
      
      // Add AI response optimistically or refresh
      const aiMsg = {
        id: crypto.randomUUID(),
        user_id: '',
        conversation_id: currentConversationId,
        role: 'assistant',
        content: result.response,
        created_at: new Date().toISOString()
      } as Message;
      
      setMessages(prev => [...prev, aiMsg]);
      fetchConversations(); // Update sidebar labels
    } catch (err: any) {
      setError(err.message);
      // Remove optimistic message on error? Maybe keep it but show error state
      throw err;
    } finally {
      setSending(false);
    }
  };

  const startNewChat = () => {
    setCurrentConversationId(crypto.randomUUID());
    setMessages([]);
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const deleteConversation = async (id: string) => {
    try {
      // Delete messages first (foreign key constraint)
      await supabase.from('ai_messages').delete().eq('conversation_id', id);
      // Delete conversation
      await supabase.from('conversations').delete().eq('id', id);
      // If we're deleting the current chat, start a new one
      if (currentConversationId === id) {
        setCurrentConversationId(crypto.randomUUID());
        setMessages([]);
      }
      await fetchConversations();
    } catch (err: any) {
      console.error('Delete conversation error:', err);
    }
  };

  return { 
    messages, 
    conversations,
    currentConversationId,
    loading, 
    sending, 
    error, 
    sendMessage, 
    startNewChat,
    selectConversation,
    deleteConversation,
    refresh: () => currentConversationId && fetchMessages(currentConversationId) 
  };
}

