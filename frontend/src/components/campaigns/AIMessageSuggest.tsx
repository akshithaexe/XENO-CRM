'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

interface AIMessageSuggestProps {
  channel: string;
  onSuggestion: (message: string) => void;
}

export default function AIMessageSuggest({ channel, onSuggestion }: AIMessageSuggestProps) {
  const [segmentDesc, setSegmentDesc] = useState('');
  const [tone, setTone] = useState('friendly');
  const { draftMessage, loading, error } = useAI();

  const handleGenerate = async () => {
    if (!segmentDesc.trim()) return;
    const message = await draftMessage({ segmentDescription: segmentDesc, channel, tone });
    if (message) onSuggestion(message);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <h4 className="text-sm font-semibold text-purple-900">AI Message Draft</h4>
      </div>
      <input
        value={segmentDesc}
        onChange={(e) => setSegmentDesc(e.target.value)}
        placeholder="Describe your audience..."
        className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500/20"
      />
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm outline-none"
      >
        <option value="friendly">Friendly</option>
        <option value="professional">Professional</option>
        <option value="urgent">Urgent</option>
        <option value="casual">Casual</option>
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button onClick={handleGenerate} loading={loading} size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
        <Sparkles className="w-3 h-3" /> Generate
      </Button>
    </div>
  );
}
