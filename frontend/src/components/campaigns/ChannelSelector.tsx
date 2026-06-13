'use client';

import React from 'react';
import { Mail, MessageSquare, Smartphone, Radio } from 'lucide-react';

const channels = [
  { id: 'email', label: 'Email', icon: Mail, color: 'from-blue-500 to-blue-600' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'from-emerald-500 to-emerald-600' },
  { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone, color: 'from-green-500 to-green-600' },
  { id: 'rcs', label: 'RCS', icon: Radio, color: 'from-purple-500 to-purple-600' },
];

interface ChannelSelectorProps {
  selected: string;
  onChange: (channel: string) => void;
}

export default function ChannelSelector({ selected, onChange }: ChannelSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {channels.map((ch) => {
        const Icon = ch.icon;
        const isSelected = selected === ch.id;

        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => onChange(ch.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? `border-brand-500 bg-brand-50 shadow-md shadow-brand-500/10`
                : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-sm'
            }`}
          >
            <div className={`p-2 rounded-lg ${isSelected ? `bg-gradient-to-br ${ch.color} text-white` : 'bg-surface-100 text-surface-500'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-sm font-medium ${isSelected ? 'text-brand-700' : 'text-surface-600'}`}>
              {ch.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
