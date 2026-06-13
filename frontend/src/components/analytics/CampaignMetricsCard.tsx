import React from 'react';
import { formatNumber, toPercent } from '@/lib/utils';
import { Send, CheckCheck, Eye, MousePointerClick } from 'lucide-react';

interface CampaignMetricsCardProps {
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  };
}

export default function CampaignMetricsCard({ stats }: CampaignMetricsCardProps) {
  const metrics = [
    { label: 'Sent', value: stats.sent, icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Delivered', value: stats.delivered, icon: CheckCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', rate: toPercent(stats.delivered, stats.sent) },
    { label: 'Opened', value: stats.opened, icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50', rate: toPercent(stats.opened, stats.delivered) },
    { label: 'Clicked', value: stats.clicked, icon: MousePointerClick, color: 'text-purple-600', bg: 'bg-purple-50', rate: toPercent(stats.clicked, stats.opened) },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div key={m.label} className="bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-surface-500">{m.label}</span>
            </div>
            <p className="text-2xl font-bold text-surface-900">{formatNumber(m.value)}</p>
            {m.rate && <p className="text-sm text-surface-400 mt-1">{m.rate} rate</p>}
          </div>
        );
      })}
    </div>
  );
}
