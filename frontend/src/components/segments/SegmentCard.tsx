'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Segment } from '@/types/segment';
import Badge from '@/components/ui/Badge';
import { formatNumber, timeAgo, formatDate } from '@/lib/utils';
import { fetchSegmentCustomers } from '@/lib/api';

interface SegmentCardProps {
  segment: Segment;
}

interface SegmentCustomer {
  id: string;
  name: string;
  email: string;
}

export default function SegmentCard({ segment }: SegmentCardProps) {
  const [customers, setCustomers] = useState<SegmentCustomer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(segment.audienceCount);

  useEffect(() => {
    fetchSegmentCustomers(segment.id)
      .then((res) => {
        setCustomers(res.data.customers || []);
        setTotalCustomers(res.data.total || segment.audienceCount);
      })
      .catch(() => {});
  }, [segment.id, segment.audienceCount]);

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
            <p className="text-headline-md font-bold text-on-surface">{formatNumber(totalCustomers)}</p>
          </div>
          <div>
            <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-xs">Created</p>
            <p className="text-body-sm font-bold text-on-surface-variant mt-xs">{formatDate(segment.createdAt)}</p>
          </div>
        </div>

        {/* Customer Names */}
        {customers.length > 0 && (
          <div className="mt-md p-md bg-surface-container-lowest rounded-lg border border-outline-variant">
            <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-sm">Sample Customers</p>
            <div className="space-y-xs">
              {customers.map((c) => (
                <div key={c.id} className="flex items-center gap-sm">
                  <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                    {c.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span className="text-body-sm text-on-surface font-medium truncate">{c.name}</span>
                  <span className="text-label-md text-on-surface-variant truncate ml-auto">{c.email}</span>
                </div>
              ))}
              {totalCustomers > customers.length && (
                <p className="text-label-md text-on-surface-variant text-center pt-xs">
                  +{formatNumber(totalCustomers - customers.length)} more
                </p>
              )}
            </div>
          </div>
        )}

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

