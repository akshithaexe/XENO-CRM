'use client';

import React, { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import DeliveryFunnelChart from '@/components/analytics/DeliveryFunnelChart';
import ChannelBreakdown from '@/components/analytics/ChannelBreakdown';
import AIInsightsSummary from '@/components/analytics/AIInsightsSummary';
import Spinner from '@/components/ui/Spinner';
import { fetchOverviewAnalytics } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = data?.deliveryStats || {};

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        mass: 0.8,
      },
    },
  };

  const deliveryMetrics = [
    { label: 'Total Sent', value: stats.sent || 0, icon: 'send', color: 'text-primary', bg: 'bg-primary-fixed' },
    { label: 'Delivered', value: stats.delivered || 0, icon: 'mark_email_read', color: 'text-secondary', bg: 'bg-secondary-fixed' },
    { label: 'Opened', value: stats.opened || 0, icon: 'drafts', color: 'text-tertiary', bg: 'bg-tertiary-fixed' },
    { label: 'Read', value: stats.read || 0, icon: 'visibility', color: 'text-primary', bg: 'bg-primary-fixed' },
    { label: 'Clicked', value: stats.clicked || 0, icon: 'ads_click', color: 'text-primary', bg: 'bg-primary-fixed' },
    { label: 'Converted', value: stats.converted || 0, icon: 'paid', color: 'text-success-on-container', bg: 'bg-success-container' },
    { label: 'Failed', value: stats.failed || 0, icon: 'error', color: 'text-error', bg: 'bg-error-container' },
  ];

  const totalSent = (stats.sent || 0) + (stats.delivered || 0) + (stats.opened || 0) + (stats.read || 0) + (stats.clicked || 0) + (stats.converted || 0);
  const conversionRate = totalSent > 0 ? ((stats.converted || 0) / totalSent * 100).toFixed(1) : '0';

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-lg pb-12">
      <motion.div variants={itemVariants}>
        <h1 className="text-headline-lg font-bold text-on-surface flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">assessment</span>
          Analytics Dashboard
        </h1>
        <p className="text-body-sm text-on-surface-variant mt-xs">Global performance across all campaigns and channels</p>
      </motion.div>

      {/* Top-level overview cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <StatCard
          title="Total Campaigns"
          value={formatNumber(data?.totalCampaigns || 0)}
          icon={<span className="material-symbols-outlined">campaign</span>}
          trend={{ value: `${data?.activeCampaigns || 0} active`, positive: true }}
        />
        <StatCard
          title="Total Customers"
          value={formatNumber(data?.totalCustomers || 0)}
          icon={<span className="material-symbols-outlined">group</span>}
        />
        <StatCard
          title="Total Messages"
          value={formatNumber(data?.totalMessages || 0)}
          icon={<span className="material-symbols-outlined">send</span>}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={<span className="material-symbols-outlined">trending_up</span>}
          trend={{ value: `${stats.converted || 0} conversions`, positive: true }}
        />
      </motion.div>

      {/* Delivery Stats - All 7 Events */}
      <motion.div variants={itemVariants}>
        <h2 className="text-body-md font-bold text-on-surface mb-md flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-sm">analytics</span>
          Delivery Event Breakdown
        </h2>
        <div className="grid grid-cols-7 gap-sm">
          {deliveryMetrics.map((m) => (
            <div key={m.label} className="bg-surface rounded-xl border border-outline-variant p-md text-center shadow-sm">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${m.bg} ${m.color} mb-xs`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
              </div>
              <p className="text-headline-md font-bold text-on-surface">{formatNumber(m.value)}</p>
              <p className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Funnel + Channel */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <DeliveryFunnelChart funnel={{
          sent: totalSent,
          delivered: (stats.delivered || 0) + (stats.opened || 0) + (stats.read || 0) + (stats.clicked || 0) + (stats.converted || 0),
          opened: (stats.opened || 0) + (stats.read || 0) + (stats.clicked || 0) + (stats.converted || 0),
          read: (stats.read || 0) + (stats.clicked || 0) + (stats.converted || 0),
          clicked: (stats.clicked || 0) + (stats.converted || 0),
          converted: stats.converted || 0,
        }} />
        <ChannelBreakdown data={data?.channelBreakdown || []} />
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={itemVariants}>
        <AIInsightsSummary />
      </motion.div>
    </motion.div>
  );
}
