'use client';

import React, { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import Spinner from '@/components/ui/Spinner';
import CampaignStatusBadge from '@/components/campaigns/CampaignStatusBadge';
import { fetchOverviewAnalytics } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import { Users, Target, Megaphone, BarChart3, TrendingUp, Send, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Premium Hero Section */}
      <motion.div variants={itemVariants} className="ai-gradient-border rounded-xl p-base shadow-sm mb-lg">
        <div className="bg-white p-lg md:p-xl rounded-lg text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low to-transparent pointer-events-none" />
          <div className="z-10 max-w-2xl">
            <h2 className="text-label-md font-bold tracking-widest text-primary uppercase mb-xs">Customer Intelligence Platform</h2>
            <h1 className="text-display-lg text-on-surface tracking-tight mb-sm">
              Turn Customer Data <br/> Into Revenue
            </h1>
            <p className="text-body-lg text-on-surface-variant font-medium max-w-xl mb-md">
              Identify high-value audiences, launch personalized campaigns, and measure business impact using AI-powered customer intelligence.
            </p>
            <div className="flex items-center gap-md flex-wrap">
              <Link href="/segments/new">
                <Button size="lg" className="px-lg font-bold text-body-sm shadow-md">
                  Build Audience
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button variant="secondary" size="lg" className="px-lg font-bold text-body-sm shadow-sm">
                  Ask AI Copilot
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Abstract Data Viz for Hero */}
          <div className="z-10 hidden lg:block border border-outline-variant glass-panel p-lg rounded-xl shadow-lg w-full max-w-md transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center justify-between mb-md border-b border-outline-variant pb-sm">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-success-on-container text-lg">trending_up</span>
                <span className="text-on-surface-variant font-bold text-body-sm">Expected Revenue Uplift</span>
              </div>
              <span className="text-on-surface font-bold text-headline-md">+24.5%</span>
            </div>
            <div className="space-y-sm">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant">
                    <span className="material-symbols-outlined text-primary text-sm">target</span>
                  </div>
                  <div className="flex-1 space-y-xs">
                    <div className="h-2 bg-surface-container-high rounded-full w-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.random() * 40 + 40}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Primary KPIs */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-lg">
        <StatCard
          title="Total Customers"
          value={formatNumber(data?.totalCustomers || 1000)}
          trend={{ value: '12%', positive: true }}
          icon={<span className="material-symbols-outlined">group</span>}
        />
        <StatCard
          title="Active Campaigns"
          value={formatNumber(data?.activeCampaigns || 0)}
          trend={{ value: '3', positive: true }}
          icon={<span className="material-symbols-outlined">campaign</span>}
        />
        <StatCard
          title="Messages Delivered"
          value={formatNumber(data?.totalMessages || 0)}
          trend={{ value: '98.5%', positive: true }}
          icon={<span className="material-symbols-outlined">send</span>}
        />
        <StatCard
          title="Avg. CTR"
          value="14.2%"
          trend={{ value: '2.1%', positive: true }}
          icon={<span className="material-symbols-outlined">trending_up</span>}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Recent Audiences */}
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden lg:col-span-1 flex flex-col shadow-sm">
          <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
            <h3 className="font-bold text-body-md text-on-surface">Top Audiences</h3>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">target</span>
          </div>
          <div className="p-lg space-y-md flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-body-sm text-on-surface">High-Value Spenders</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">Total Spend &gt; 5000</p>
              </div>
              <span className="text-body-sm font-bold text-primary">124 users</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-body-sm text-on-surface">Churn Risks</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">Last Visit &gt; 90 days</p>
              </div>
              <span className="text-body-sm font-bold text-error">89 users</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-body-sm text-on-surface">New Signups</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">Joined last 7 days</p>
              </div>
              <span className="text-body-sm font-bold text-success-on-container">45 users</span>
            </div>
          </div>
          <div className="px-lg py-md border-t border-outline-variant bg-surface-container-low">
            <Link href="/segments" className="text-body-sm text-primary hover:text-primary-fixed-variant font-bold flex items-center gap-xs">
              View all segments <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden lg:col-span-2 shadow-sm">
          <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
            <h3 className="font-bold text-body-md text-on-surface">Active Campaigns</h3>
            <Link href="/campaigns" className="text-body-sm text-primary hover:text-primary-fixed-variant font-bold">
              View all
            </Link>
          </div>
          <div className="divide-y divide-outline-variant">
            {(data?.recentCampaigns || []).length === 0 ? (
              <div className="p-xl text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-sm opacity-50">campaign</span>
                <p className="text-body-sm">No campaigns running currently.</p>
                <Link href="/campaigns/new" className="text-primary text-body-sm font-bold mt-sm inline-block hover:text-primary-fixed-variant">
                  Launch a Campaign →
                </Link>
              </div>
            ) : (
              data.recentCampaigns.map((c: any) => (
                <Link href={`/campaigns/${c.id}`} key={c.id}>
                  <div className="px-lg py-md hover:bg-surface-container transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-sm">campaign</span>
                      </div>
                      <div>
                        <p className="font-bold text-body-sm text-on-surface">{c.name}</p>
                        <p className="text-label-md text-on-surface-variant mt-0.5 uppercase tracking-wide">{c.channel}</p>
                      </div>
                    </div>
                    <CampaignStatusBadge status={c.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
