'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import SegmentPreview from '@/components/segments/SegmentPreview';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { useSegment } from '@/hooks/useSegments';
import { fetchSegmentCustomers } from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface SegmentCustomer {
  id: string;
  name: string;
  email: string;
  totalSpend?: number;
  visitCount?: number;
  phone?: string;
}

export default function SegmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { segment, loading } = useSegment(id);
  const [customers, setCustomers] = useState<SegmentCustomer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [customersLoading, setCustomersLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setCustomersLoading(true);
      fetchSegmentCustomers(id)
        .then((res) => {
          setCustomers(res.data.customers || []);
          setTotalCustomers(res.data.total || 0);
        })
        .catch(() => {})
        .finally(() => setCustomersLoading(false));
    }
  }, [id]);

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

        {/* Matching Customers */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-surface-900">
              Matching Customers
              {totalCustomers > 0 && (
                <span className="text-sm font-normal text-surface-400 ml-2">
                  (showing {customers.length} of {formatNumber(totalCustomers)})
                </span>
              )}
            </h3>
          </div>

          {customersLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left py-3 px-4 text-surface-500 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-surface-500 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                            {c.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-surface-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-surface-500">{c.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalCustomers > customers.length && (
                <p className="text-center text-sm text-surface-400 mt-4">
                  + {formatNumber(totalCustomers - customers.length)} more customers match this segment
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-surface-400 text-center py-8">No customers match this segment yet.</p>
          )}
        </div>

        {/* Segment Rules */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-sm">rule</span>
            </div>
            <h3 className="font-semibold text-surface-900">Segment Rules</h3>
          </div>
          <p className="text-sm text-surface-500 mb-4">
            Customers are included when <strong className="text-surface-700">{segment.rules.logic === 'AND' ? 'all' : 'any'}</strong> of the following conditions are met:
          </p>
          <div className="space-y-3">
            {(segment.rules.conditions as any[]).map((cond, idx) => {
              const fieldLabels: Record<string, string> = {
                totalSpend: 'Total Spend',
                total_spend: 'Total Spend',
                visitCount: 'Visit Count',
                visit_count: 'Visit Count',
                lastVisit: 'Last Visit',
                last_visit: 'Last Visit',
                createdAt: 'Account Created',
                created_at: 'Account Created',
                name: 'Customer Name',
                email: 'Email Address',
                phone: 'Phone Number',
                tags: 'Tags',
              };
              const operatorLabels: Record<string, string> = {
                eq: 'is equal to',
                neq: 'is not equal to',
                gt: 'is greater than',
                gte: 'is at least',
                lt: 'is less than',
                lte: 'is at most',
                in: 'is one of',
                nin: 'is not one of',
                contains: 'contains',
                not_contains: 'does not contain',
              };

              const fieldName = fieldLabels[cond.field] || cond.field;
              const operatorName = operatorLabels[cond.operator] || cond.operator;

              const isMoneyField = ['totalSpend', 'total_spend'].includes(cond.field);
              let displayValue = cond.value;
              if (isMoneyField && typeof cond.value === 'number') {
                displayValue = `₹${cond.value.toLocaleString()}`;
              } else if (Array.isArray(cond.value)) {
                displayValue = cond.value.join(', ');
              } else if (typeof cond.value === 'object') {
                displayValue = JSON.stringify(cond.value);
              }

              return (
                <div key={idx}>
                  {idx > 0 && (
                    <div className="flex items-center gap-2 py-1 pl-4">
                      <div className="w-px h-4 bg-surface-200" />
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{segment.rules.logic}</span>
                      <div className="w-px h-4 bg-surface-200" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl border border-surface-100">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xs font-bold">{idx + 1}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span className="font-semibold text-surface-800 bg-white px-2 py-0.5 rounded border border-surface-200">{fieldName}</span>
                      <span className="text-surface-500">{operatorName}</span>
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{displayValue}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

