'use client';

import { useState } from 'react';
import { aiSuggestSegment, aiDraftMessage, aiGetInsights } from '@/lib/api';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestSegment = async (description: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiSuggestSegment(description);
      return res.data.rules;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const draftMessage = async (params: {
    segmentDescription: string;
    channel: string;
    tone?: string;
    goal?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiDraftMessage(params);
      return res.data.message;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiGetInsights();
      return res.data.insights;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { suggestSegment, draftMessage, getInsights, loading, error };
}
