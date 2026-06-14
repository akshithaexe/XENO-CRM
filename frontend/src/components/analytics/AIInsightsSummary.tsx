'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useAI } from '@/hooks/useAI';

/**
 * Strips markdown formatting artifacts from AI text to produce clean professional output.
 */
function cleanAIText(text: string): string {
  return text
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bullet point dashes at start of lines
    .replace(/^[-•]\s+/gm, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function AIInsightsSummary() {
  const [insights, setInsights] = useState<string | null>(null);
  const { getInsights, loading, error } = useAI();

  const fetchInsights = async () => {
    const result = await getInsights();
    if (result) setInsights(cleanAIText(result));
  };

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant p-lg space-y-md shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">insights</span>
          </div>
          <h3 className="font-bold text-on-surface text-body-md">Performance Insights</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchInsights} loading={loading}>
          <span className="material-symbols-outlined text-sm">refresh</span>
          {insights ? 'Refresh' : 'Generate'}
        </Button>
      </div>

      {error && <p className="text-body-sm text-error">{error}</p>}

      {insights ? (
        <div className="text-body-sm text-on-surface leading-relaxed whitespace-pre-wrap">{insights}</div>
      ) : (
        <p className="text-body-sm text-on-surface-variant">
          Click &quot;Generate&quot; to get AI-powered performance insights based on your campaign data.
        </p>
      )}
    </div>
  );
}

