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
    status: 'draft' as string,
    scheduledAt: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name: formData.name,
      segmentId: formData.segmentId,
      channel: formData.channel,
      message: formData.message,
      status: formData.status,
    };
    if (formData.status === 'scheduled' && formData.scheduledAt) {
      payload.scheduledAt = new Date(formData.scheduledAt).toISOString();
    }
    onSubmit(payload);
  };

  // Get minimum date-time (now) for the date picker
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
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

      {/* Campaign Status / Scheduling */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Launch Option</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: 'draft', scheduledAt: '' })}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              formData.status === 'draft'
                ? 'border-primary bg-primary/5'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <span className={`material-symbols-outlined ${formData.status === 'draft' ? 'text-primary' : 'text-surface-400'}`}>edit_note</span>
            <div className="text-left">
              <p className={`text-sm font-semibold ${formData.status === 'draft' ? 'text-primary' : 'text-surface-700'}`}>Save as Draft</p>
              <p className="text-xs text-surface-400">Launch manually later</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: 'scheduled' })}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              formData.status === 'scheduled'
                ? 'border-primary bg-primary/5'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <span className={`material-symbols-outlined ${formData.status === 'scheduled' ? 'text-primary' : 'text-surface-400'}`}>schedule_send</span>
            <div className="text-left">
              <p className={`text-sm font-semibold ${formData.status === 'scheduled' ? 'text-primary' : 'text-surface-700'}`}>Schedule</p>
              <p className="text-xs text-surface-400">Set date and time</p>
            </div>
          </button>
        </div>
      </div>

      {/* Schedule Date/Time Picker */}
      {formData.status === 'scheduled' && (
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Scheduled Date & Time</label>
          <input
            type="datetime-local"
            value={formData.scheduledAt}
            min={getMinDateTime()}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            required
          />
          <p className="text-xs text-surface-400 mt-1">The campaign will be automatically launched at this time.</p>
        </div>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full">
        {formData.status === 'scheduled' ? 'Schedule Campaign' : 'Create Campaign'}
      </Button>
    </form>
  );
}

