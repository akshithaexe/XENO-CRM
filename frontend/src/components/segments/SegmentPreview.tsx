import React from 'react';
import { Users } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface SegmentPreviewProps {
  audienceCount: number;
  loading?: boolean;
}

export default function SegmentPreview({ audienceCount, loading }: SegmentPreviewProps) {
  return (
    <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200 p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brand-500 rounded-xl text-white">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-brand-600">Estimated Audience</p>
          {loading ? (
            <div className="h-8 w-24 bg-brand-200 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-3xl font-bold text-brand-900">{formatNumber(audienceCount)}</p>
          )}
          <p className="text-xs text-brand-500 mt-0.5">customers match this segment</p>
        </div>
      </div>
    </div>
  );
}
