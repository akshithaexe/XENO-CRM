'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useAI } from '@/hooks/useAI';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function AIInsightsSummary() {
  const [insights, setInsights] = useState<string | null>(null);
  const { getInsights, loading, error } = useAI();

  const fetchInsights = async () => {
    const result = await getInsights();
    if (result) setInsights(result);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-brand-50 to-pink-50 rounded-2xl border border-purple-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">AI Insights</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchInsights} loading={loading}>
          <RefreshCw className="w-3.5 h-3.5" />
          {insights ? 'Refresh' : 'Generate'}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {insights ? (
        <div className="prose prose-sm text-purple-800 whitespace-pre-wrap">{insights}</div>
      ) : (
        <p className="text-sm text-purple-600">
          Click &quot;Generate&quot; to get AI-powered performance insights based on your campaign data.
        </p>
      )}
    </div>
  );
}
