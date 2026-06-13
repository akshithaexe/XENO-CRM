'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import SegmentPreview from '@/components/segments/SegmentPreview';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { useSegment } from '@/hooks/useSegments';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SegmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { segment, loading } = useSegment(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!segment) {
    return <div className="p-8 text-center text-surface-500">Segment not found</div>;
  }

  return (
    <div>
      <Navbar title="Segment Detail" />

      <div className="p-8 space-y-6 animate-fade-in max-w-4xl">
        <Link href="/segments" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Segments
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">{segment.name}</h2>
            {segment.description && <p className="text-surface-500 mt-1">{segment.description}</p>}
            <p className="text-sm text-surface-400 mt-2">Created {formatDate(segment.createdAt)}</p>
          </div>
          {segment.isAIGenerated && (
            <Badge variant="purple" size="md">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> AI Generated
            </Badge>
          )}
        </div>

        <SegmentPreview audienceCount={segment.audienceCount} />

        <div className="bg-white rounded-2xl border border-surface-200 p-6">
          <h3 className="font-semibold text-surface-900 mb-4">Rules</h3>
          <div className="space-y-2">
            <Badge variant="info" size="md">{segment.rules.logic}</Badge>
            {(segment.rules.conditions as any[]).map((cond, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-surface-50 rounded-lg text-sm">
                <span className="font-medium text-surface-700">{cond.field}</span>
                <span className="text-surface-400">{cond.operator}</span>
                <span className="text-brand-600 font-medium">{JSON.stringify(cond.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
