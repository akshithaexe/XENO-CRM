'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import StatCard from '@/components/ui/StatCard';
import DeliveryFunnelChart from '@/components/analytics/DeliveryFunnelChart';
import ChannelBreakdown from '@/components/analytics/ChannelBreakdown';
import AIInsightsSummary from '@/components/analytics/AIInsightsSummary';
import Spinner from '@/components/ui/Spinner';
import { fetchOverviewAnalytics } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import { BarChart3, Send, CheckCheck, AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewAnalytics()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = data?.deliveryStats || {};

  return (
    <div>
      <Navbar title="Analytics" />

      <div className="p-8 space-y-8 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Global Insights</h2>
          <p className="text-surface-500 mt-1">Overall performance across all campaigns</p>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Messages"
            value={formatNumber(data?.totalMessages || 0)}
            icon={<Send className="w-6 h-6" />}
          />
          <StatCard
            title="Delivered"
            value={formatNumber(stats.delivered || 0)}
            icon={<CheckCheck className="w-6 h-6" />}
          />
          <StatCard
            title="Total Campaigns"
            value={formatNumber(data?.totalCampaigns || 0)}
            icon={<BarChart3 className="w-6 h-6" />}
          />
          <StatCard
            title="Failed"
            value={formatNumber(stats.failed || 0)}
            icon={<AlertTriangle className="w-6 h-6" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeliveryFunnelChart funnel={{
            sent: (stats.sent || 0) + (stats.delivered || 0) + (stats.opened || 0) + (stats.clicked || 0),
            delivered: (stats.delivered || 0) + (stats.opened || 0) + (stats.clicked || 0),
            opened: (stats.opened || 0) + (stats.clicked || 0),
            clicked: stats.clicked || 0,
          }} />
          <ChannelBreakdown data={data?.channelBreakdown || []} />
        </div>

        {/* AI Insights */}
        <AIInsightsSummary />
      </div>
    </div>
  );
}
