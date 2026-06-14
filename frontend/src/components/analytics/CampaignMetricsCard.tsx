import React from 'react';
import { formatNumber, toPercent } from '@/lib/utils';

interface CampaignMetricsCardProps {
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    read?: number;
    clicked: number;
    converted?: number;
    failed: number;
  };
}

export default function CampaignMetricsCard({ stats }: CampaignMetricsCardProps) {
  const metrics = [
    { label: 'Sent', value: stats.sent, icon: 'send', color: 'text-primary', bg: 'bg-primary-fixed' },
    { label: 'Delivered', value: stats.delivered, icon: 'mark_email_read', color: 'text-secondary', bg: 'bg-secondary-fixed', rate: toPercent(stats.delivered, stats.sent) },
    { label: 'Opened', value: stats.opened, icon: 'drafts', color: 'text-tertiary', bg: 'bg-tertiary-fixed', rate: toPercent(stats.opened, stats.delivered) },
    { label: 'Read', value: stats.read || 0, icon: 'visibility', color: 'text-primary', bg: 'bg-primary-fixed', rate: toPercent(stats.read || 0, stats.opened) },
    { label: 'Clicked', value: stats.clicked, icon: 'ads_click', color: 'text-primary', bg: 'bg-primary-fixed', rate: toPercent(stats.clicked, stats.read || stats.opened) },
    { label: 'Converted', value: stats.converted || 0, icon: 'paid', color: 'text-success-on-container', bg: 'bg-success-container', rate: toPercent(stats.converted || 0, stats.clicked) },
    { label: 'Failed', value: stats.failed, icon: 'error', color: 'text-error', bg: 'bg-error-container', rate: toPercent(stats.failed, stats.sent) },
  ];

  return (
    <div className="grid grid-cols-7 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white rounded-xl border border-outline-variant p-4 hover:shadow-md transition-shadow shadow-sm text-center">
          <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${m.bg} ${m.color} mb-2`}>
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
          </div>
          <p className="text-headline-md font-bold text-on-surface">{formatNumber(m.value)}</p>
          <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">{m.label}</p>
          {m.rate && <p className="text-label-md text-on-surface-variant mt-0.5">{m.rate}</p>}
        </div>
      ))}
    </div>
  );
}
