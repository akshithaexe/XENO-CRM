'use client';

import React, { useState } from 'react';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CampaignStatusBadge from '@/components/campaigns/CampaignStatusBadge';
import { useCampaigns } from '@/hooks/useCampaigns';
import { formatDate, formatNumber } from '@/lib/utils';
import Link from 'next/link';

import { motion } from 'framer-motion';

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const { campaigns, loading } = useCampaigns({ status: statusFilter !== 'all' ? statusFilter : undefined });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-lg space-y-lg"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Campaigns</h2>
          <p className="text-body-sm text-on-surface-variant mt-xs">Create and manage your marketing campaigns</p>
        </div>
        <Link href="/campaigns/new">
          <Button>
            <span className="material-symbols-outlined text-sm">add</span> Create Campaign
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-sm border-b border-outline-variant pb-sm">
        {['all', 'draft', 'scheduled', 'running', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-md py-sm text-label-md font-bold rounded-lg capitalize transition-colors ${
              statusFilter === status
                ? 'bg-secondary-fixed text-on-secondary-fixed'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {status}
          </button>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-xl">
            <Spinner size="lg" />
          </div>
        ) : campaigns.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-xl bg-surface-container-lowest border border-outline-variant rounded-xl border-dashed"
          >
            <p className="text-body-md text-on-surface-variant">No campaigns found.</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-sm"
          >
            {campaigns.map((c) => {
              const segName = typeof c.segmentId === 'object' ? c.segmentId.name : '—';
              const segCount = typeof c.segmentId === 'object' ? c.segmentId.audienceCount : 0;

              return (
                <Link href={`/campaigns/${c.id}`} key={c.id}>
                  <div className="bg-white rounded-xl border border-outline-variant p-md hover:border-primary transition-all cursor-pointer shadow-sm group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 bg-surface-container border border-outline-variant rounded-lg text-on-surface-variant flex items-center justify-center group-hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-sm">campaign</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-body-sm text-on-surface">{c.name}</h3>
                          <div className="flex items-center gap-sm mt-xs text-label-md text-on-surface-variant">
                            <Badge variant="info">{c.channel}</Badge>
                            <span>→ {segName} ({formatNumber(segCount)})</span>
                            <span>•</span>
                            <span>{formatDate(c.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-lg">
                        <div className="text-right text-sm">
                          <p className="text-on-surface-variant text-label-md uppercase tracking-wider">Sent</p>
                          <p className="font-bold text-body-sm text-on-surface">{formatNumber(c.stats.sent)}</p>
                        </div>
                        <CampaignStatusBadge status={c.status} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
