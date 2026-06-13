import React from 'react';
import { formatNumber } from '@/lib/utils';
import { Mail, MessageSquare, Smartphone, Radio } from 'lucide-react';

interface ChannelBreakdownProps {
  data: { _id: string; count: number }[];
}

const channelIcons: Record<string, any> = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: Smartphone,
  rcs: Radio,
};

const channelColors: Record<string, string> = {
  email: 'bg-blue-500',
  sms: 'bg-emerald-500',
  whatsapp: 'bg-green-500',
  rcs: 'bg-purple-500',
};

export default function ChannelBreakdown({ data }: ChannelBreakdownProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6">
      <h3 className="text-sm font-semibold text-surface-700 mb-4">Channel Breakdown</h3>

      {data.length === 0 ? (
        <p className="text-sm text-surface-400">No data available</p>
      ) : (
        <div className="space-y-4">
          {/* Visual bar */}
          <div className="flex h-4 rounded-full overflow-hidden">
            {data.map((d) => (
              <div
                key={d._id}
                className={`${channelColors[d._id] || 'bg-surface-400'} transition-all`}
                style={{ width: `${(d.count / total) * 100}%` }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3">
            {data.map((d) => {
              const Icon = channelIcons[d._id] || Mail;
              return (
                <div key={d._id} className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                  <div className={`w-3 h-3 rounded-full ${channelColors[d._id] || 'bg-surface-400'}`} />
                  <Icon className="w-4 h-4 text-surface-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-surface-700 capitalize">{d._id}</p>
                    <p className="text-xs text-surface-400">{formatNumber(d.count)} messages</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
