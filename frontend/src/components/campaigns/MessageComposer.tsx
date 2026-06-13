'use client';

import React from 'react';

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  channel: string;
}

export default function MessageComposer({ value, onChange, channel }: MessageComposerProps) {
  const charLimits: Record<string, number> = {
    sms: 160,
    whatsapp: 4096,
    email: 10000,
    rcs: 4096,
  };

  const limit = charLimits[channel] || 4096;
  const percentage = (value.length / limit) * 100;

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Write your ${channel} message here...`}
        className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm resize-none h-40 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
      />
      <div className="flex items-center justify-between text-xs">
        <span className={`${percentage > 90 ? 'text-red-500' : 'text-surface-400'}`}>
          {value.length} / {limit} characters
        </span>
        <div className="w-24 h-1.5 bg-surface-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-amber-500' : 'bg-brand-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
