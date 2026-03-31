'use client';

import { useState, useEffect } from 'react';

export interface Insight {
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  suggestion: string;
}

import { useAuth } from './useAuth';

export function useAIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const fetchInsights = async () => {
    if (!user) {
      setInsights([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/ai/insights');
      if (!response.ok) throw new Error('Failed to fetch insights');
      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchInsights();
    }
  }, [user, authLoading]);

  return { insights, loading, error, refresh: fetchInsights };
}
