import React from 'react';
import { formatNumber } from '@/lib/utils';

interface DeliveryFunnelChartProps {
  funnel: {
    sent: number;
    delivered: number;
    opened: number;
    read?: number;
    clicked: number;
    converted?: number;
  };
}

export default function DeliveryFunnelChart({ funnel }: DeliveryFunnelChartProps) {
  const maxVal = Math.max(funnel.sent, 1);
  const stages = [
    { label: 'Sent', value: funnel.sent, color: 'from-primary to-primary-container', icon: 'send' },
    { label: 'Delivered', value: funnel.delivered, color: 'from-secondary to-secondary-container', icon: 'mark_email_read' },
    { label: 'Opened', value: funnel.opened, color: 'from-tertiary to-tertiary-container', icon: 'drafts' },
    { label: 'Read', value: funnel.read || 0, color: 'from-primary-fixed-dim to-tertiary-fixed-dim', icon: 'visibility' },
    { label: 'Clicked', value: funnel.clicked, color: 'from-primary to-tertiary', icon: 'ads_click' },
    { label: 'Converted', value: funnel.converted || 0, color: 'from-success-on-container to-secondary', icon: 'paid' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-sm">
      <div className="flex items-center gap-sm mb-6">
        <span className="material-symbols-outlined text-primary text-sm">filter_alt</span>
        <h3 className="text-body-sm font-bold text-on-surface">Engagement Funnel</h3>
      </div>
      <div className="space-y-4">
        {stages.map((stage) => {
          const width = (stage.value / maxVal) * 100;
          const rate = stage.label !== 'Sent' ? ` (${maxVal > 0 ? ((stage.value / maxVal) * 100).toFixed(1) : 0}%)` : '';
          return (
            <div key={stage.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-body-sm">
                <span className="font-bold text-on-surface flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{stage.icon}</span>
                  {stage.label}
                </span>
                <span className="text-on-surface-variant">{formatNumber(stage.value)}{rate}</span>
              </div>
              <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stage.color} transition-all duration-700`}
                  style={{ width: `${Math.max(width, stage.value > 0 ? 2 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
