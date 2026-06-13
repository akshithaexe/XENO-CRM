'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { SegmentRuleGroup } from '@/types/segment';

interface AISuggestSegmentProps {
  onSuggestion: (rules: SegmentRuleGroup) => void;
}

export default function AISuggestSegment({ onSuggestion }: AISuggestSegmentProps) {
  const [description, setDescription] = useState('');
  const { suggestSegment, loading, error } = useAI();

  const handleSuggest = async () => {
    if (!description.trim()) return;
    const rules = await suggestSegment(description);
    if (rules) {
      onSuggestion(rules);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-brand-50 rounded-2xl border border-purple-200 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-purple-900">AI Segment Suggestion</h3>
      </div>
      <p className="text-sm text-purple-700">
        Describe your target audience in natural language and let AI build the segment rules for you.
      </p>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., Customers who spent more than $500 in the last 3 months and haven't visited in 30 days..."
        className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm resize-none h-24 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button onClick={handleSuggest} loading={loading} className="bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700">
        <Sparkles className="w-4 h-4" />
        Generate Rules
      </Button>
    </div>
  );
}
