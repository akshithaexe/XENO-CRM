'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import CampaignMetricsCard from '@/components/analytics/CampaignMetricsCard';
import DeliveryFunnelChart from '@/components/analytics/DeliveryFunnelChart';
import CampaignStatusBadge from '@/components/campaigns/CampaignStatusBadge';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useCampaign } from '@/hooks/useCampaigns';
import { launchCampaign } from '@/lib/api';
import { formatDate, truncate } from '@/lib/utils';
import { ArrowLeft, Play, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { campaign, loading } = useCampaign(id);
  const [launching, setLaunching] = useState(false);

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      await launchCampaign(id);
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLaunching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!campaign) {
    return <div className="p-8 text-center text-surface-500">Campaign not found</div>;
  }

  return (
    <div>
      <Navbar title="Campaign Detail" />

      <div className="p-8 space-y-6 animate-fade-in">
        <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-surface-900">{campaign.name}</h2>
              <CampaignStatusBadge status={campaign.status} />
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-surface-500">
              <Badge variant="info">{campaign.channel}</Badge>
              <span>Created {formatDate(campaign.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            {(campaign.status === 'running' || campaign.status === 'completed') && (
              <Link href={`/campaigns/${id}/timeline`}>
                <Button variant="secondary">
                  <span className="material-symbols-outlined text-sm">timeline</span> View Timeline
                </Button>
              </Link>
            )}
            {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
              <Button onClick={handleLaunch} loading={launching}>
                <Play className="w-4 h-4" /> Launch Campaign
              </Button>
            )}
          </div>
        </div>

        {/* Message Preview */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-surface-400" />
            <h3 className="font-semibold text-surface-700">Message</h3>
          </div>
          <p className="text-surface-600 bg-surface-50 p-4 rounded-xl text-sm whitespace-pre-wrap">{campaign.message}</p>
        </div>

        {/* Metrics */}
        <CampaignMetricsCard stats={campaign.stats} />

        {/* Funnel */}
        <DeliveryFunnelChart funnel={{
          sent: campaign.stats.sent,
          delivered: campaign.stats.delivered,
          opened: campaign.stats.opened,
          read: campaign.stats.read || 0,
          clicked: campaign.stats.clicked,
          converted: campaign.stats.converted || 0,
        }} />
      </div>
    </div>
  );
}
