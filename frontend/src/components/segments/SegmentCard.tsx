import React from 'react';
import Link from 'next/link';
import { Segment } from '@/types/segment';
import Badge from '@/components/ui/Badge';
import { formatNumber, timeAgo, formatDate } from '@/lib/utils';
import { Users, Target, Sparkles } from 'lucide-react';

interface SegmentCardProps {
  segment: Segment;
}

export default function SegmentCard({ segment }: SegmentCardProps) {
  return (
    <Link href={`/segments/${segment.id}`}>
      <div className="bg-white rounded-xl border border-outline-variant p-md hover:border-primary transition-all duration-300 group cursor-pointer shadow-sm">
        <div className="flex items-start justify-between mb-md">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-surface-container border border-outline-variant rounded-lg flex items-center justify-center text-primary group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-sm">target</span>
            </div>
            <div>
              <h3 className="font-bold text-body-sm text-on-surface">{segment.name}</h3>
              <p className="text-label-md text-on-surface-variant mt-0.5 line-clamp-1">{segment.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-md mt-lg p-md bg-surface-container-lowest rounded-lg border border-outline-variant">
          <div>
            <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-xs">Audience Size</p>
            <p className="text-headline-md font-bold text-on-surface">{formatNumber(segment.audienceCount)}</p>
          </div>
          <div>
            <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-xs">Created</p>
            <p className="text-body-sm font-bold text-on-surface-variant mt-xs">{formatDate(segment.createdAt)}</p>
          </div>
        </div>

        <div className="mt-md pt-md border-t border-outline-variant flex items-center justify-between text-label-md font-bold">
          <span className="text-primary flex items-center gap-xs group-hover:text-primary-fixed-variant">
            View segment details <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </span>
          <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">
            {segment.rules.conditions.length} rules
          </span>
        </div>
      </div>
    </Link>
  );
}
