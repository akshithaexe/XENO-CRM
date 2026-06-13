import React from 'react';
import { formatNumber } from '@/lib/utils';

interface DeliveryFunnelChartProps {
  funnel: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
}

export default function DeliveryFunnelChart({ funnel }: DeliveryFunnelChartProps) {
  const maxVal = Math.max(funnel.sent, 1);
  const stages = [
    { label: 'Sent', value: funnel.sent, color: 'from-blue-500 to-blue-600' },
    { label: 'Delivered', value: funnel.delivered, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Opened', value: funnel.opened, color: 'from-amber-500 to-amber-600' },
    { label: 'Clicked', value: funnel.clicked, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6">
      <h3 className="text-sm font-semibold text-surface-700 mb-6">Delivery Funnel</h3>
      <div className="space-y-4">
        {stages.map((stage, idx) => {
          const width = (stage.value / maxVal) * 100;
          return (
            <div key={stage.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-surface-700">{stage.label}</span>
                <span className="text-surface-500">{formatNumber(stage.value)}</span>
              </div>
              <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stage.color} transition-all duration-700`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
