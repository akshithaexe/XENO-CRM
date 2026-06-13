'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import ChannelSelector from './ChannelSelector';
import MessageComposer from './MessageComposer';

interface CampaignFormProps {
  segments: { id: string; name: string; audienceCount: number }[];
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function CampaignForm({ segments, onSubmit, loading }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    segmentId: '',
    channel: 'email' as string,
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campaign Name */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Campaign Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Summer Sale Blast"
          className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          required
        />
      </div>

      {/* Segment Selection */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Target Segment</label>
        <select
          value={formData.segmentId}
          onChange={(e) => setFormData({ ...formData, segmentId: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
          required
        >
          <option value="">Select a segment...</option>
          {segments.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.audienceCount} customers)
            </option>
          ))}
        </select>
      </div>

      {/* Channel */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Channel</label>
        <ChannelSelector
          selected={formData.channel}
          onChange={(channel) => setFormData({ ...formData, channel })}
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Message</label>
        <MessageComposer
          value={formData.message}
          onChange={(message) => setFormData({ ...formData, message })}
          channel={formData.channel}
        />
      </div>

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Create Campaign
      </Button>
    </form>
  );
}
