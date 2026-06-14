'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCampaignById, fetchCampaignLogs } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import CampaignStatusBadge from '@/components/campaigns/CampaignStatusBadge';
import { timeAgo } from '@/lib/utils';

const STATUS_ORDER = ['sent', 'delivered', 'opened', 'read', 'clicked', 'converted'] as const;
const STATUS_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  sent: { icon: 'send', color: 'text-on-surface-variant', bg: 'bg-surface-container-high', label: 'Sent' },
  delivered: { icon: 'mark_email_read', color: 'text-primary', bg: 'bg-primary-fixed', label: 'Delivered' },
  opened: { icon: 'drafts', color: 'text-secondary', bg: 'bg-secondary-fixed', label: 'Opened' },
  read: { icon: 'visibility', color: 'text-tertiary', bg: 'bg-tertiary-fixed', label: 'Read' },
  clicked: { icon: 'ads_click', color: 'text-primary', bg: 'bg-primary-fixed', label: 'Clicked' },
  converted: { icon: 'paid', color: 'text-success-on-container', bg: 'bg-success-container', label: 'Converted' },
  failed: { icon: 'error', color: 'text-error', bg: 'bg-error-container', label: 'Failed' },
};

function StatusPill({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.sent;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-md font-bold ${config.bg} ${config.color}`}>
      <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>{config.icon}</span>
      {config.label}
    </span>
  );
}

function StatusTimeline({ log }: { log: any }) {
  const currentIdx = STATUS_ORDER.indexOf(log.status);
  const isFailed = log.status === 'failed';

  return (
    <div className="flex items-center gap-1">
      {STATUS_ORDER.map((s, i) => {
        const config = STATUS_CONFIG[s];
        const reached = !isFailed && i <= currentIdx;
        const isCurrent = !isFailed && i === currentIdx;

        return (
          <React.Fragment key={s}>
            <motion.div
              initial={isCurrent ? { scale: 0 } : false}
              animate={isCurrent ? { scale: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                reached
                  ? `${config.bg} ${config.color}`
                  : 'bg-surface-container-high text-on-surface-variant/30'
              } ${isCurrent ? 'ring-2 ring-offset-1 ring-primary/30 shadow-sm' : ''}`}
              title={config.label}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: reached ? "'FILL' 1" : "'FILL' 0" }}>
                {config.icon}
              </span>
            </motion.div>
            {i < STATUS_ORDER.length - 1 && (
              <div className={`w-4 h-0.5 rounded-full transition-colors duration-300 ${
                !isFailed && i < currentIdx ? 'bg-primary/40' : 'bg-outline-variant/30'
              }`} />
            )}
          </React.Fragment>
        );
      })}
      {isFailed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-2 w-7 h-7 rounded-full bg-error-container text-error flex items-center justify-center ring-2 ring-offset-1 ring-error/20"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>error</span>
        </motion.div>
      )}
    </div>
  );
}

export default function CommunicationTimelinePage() {
  const params = useParams();
  const id = params.id as string;
  const [campaign, setCampaign] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [campRes, logsRes] = await Promise.all([
        fetchCampaignById(id),
        fetchCampaignLogs(id, { limit: 200 }),
      ]);
      setCampaign(campRes.data);
      setLogs(logsRes.data || []);

      // Stop polling if campaign is done
      if (campRes.data?.status === 'completed' || campRes.data?.status === 'failed') {
        setPolling(false);
      }
    } catch (err) {
      console.error('Timeline fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Poll every 3 seconds while campaign is running
  useEffect(() => {
    if (!polling) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    pollingRef.current = setInterval(fetchData, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [polling, fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!campaign) {
    return <div className="p-8 text-center text-on-surface-variant">Campaign not found</div>;
  }

  const stats = campaign.stats || {};
  const statItems = [
    { key: 'sent', label: 'Sent', value: stats.sent || 0 },
    { key: 'delivered', label: 'Delivered', value: stats.delivered || 0 },
    { key: 'failed', label: 'Failed', value: stats.failed || 0 },
    { key: 'opened', label: 'Opened', value: stats.opened || 0 },
    { key: 'read', label: 'Read', value: stats.read || 0 },
    { key: 'clicked', label: 'Clicked', value: stats.clicked || 0 },
    { key: 'converted', label: 'Converted', value: stats.converted || 0 },
  ];

  return (
    <div className="space-y-lg pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <Link href={`/campaigns/${id}`} className="inline-flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-primary transition-colors mb-md">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Campaign
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-md">
              <h1 className="text-headline-lg font-bold text-on-surface">{campaign.name}</h1>
              <CampaignStatusBadge status={campaign.status} />
            </div>
            <p className="text-body-sm text-on-surface-variant mt-xs flex items-center gap-sm">
              <span className="material-symbols-outlined text-sm">timeline</span>
              Communication Timeline
              {polling && (
                <span className="inline-flex items-center gap-1 text-success-on-container">
                  <span className="w-2 h-2 rounded-full bg-success-on-container animate-pulse" />
                  <span className="text-label-md font-bold">LIVE</span>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-7 gap-sm">
        {statItems.map((item) => {
          const config = STATUS_CONFIG[item.key];
          return (
            <motion.div
              key={item.key}
              layout
              className={`rounded-xl p-md text-center border border-outline-variant bg-surface shadow-sm`}
            >
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${config.bg} ${config.color} mb-xs`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{config.icon}</span>
              </div>
              <p className="text-headline-md font-bold text-on-surface">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.value}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.value}
                  </motion.span>
                </AnimatePresence>
              </p>
              <p className="text-label-md text-on-surface-variant uppercase tracking-wider">{item.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline Table */}
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
          <h3 className="font-bold text-body-md text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-sm">timeline</span>
            Message Delivery Timeline
          </h3>
          <span className="text-label-md text-on-surface-variant">{logs.length} messages</span>
        </div>

        <div className="divide-y divide-outline-variant max-h-[60vh] overflow-y-auto custom-scrollbar">
          {logs.length === 0 ? (
            <div className="p-xl text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-sm opacity-50">hourglass_empty</span>
              <p className="text-body-sm">No messages dispatched yet. Launch the campaign to see the timeline.</p>
            </div>
          ) : (
            <AnimatePresence>
              {logs.map((log: any, idx: number) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                  className="px-lg py-md flex items-center gap-lg hover:bg-surface-container-low transition-colors"
                >
                  {/* Customer info */}
                  <div className="w-48 flex-shrink-0">
                    <p className="text-body-sm font-bold text-on-surface truncate">
                      {log.customers?.name || 'Unknown'}
                    </p>
                    <p className="text-label-md text-on-surface-variant truncate">
                      {log.customers?.email || log.customerId}
                    </p>
                  </div>

                  {/* Status timeline visualization */}
                  <div className="flex-1">
                    <StatusTimeline log={log} />
                  </div>

                  {/* Current status pill */}
                  <div className="w-28 flex-shrink-0 text-right">
                    <StatusPill status={log.status} />
                  </div>

                  {/* Time */}
                  <div className="w-24 flex-shrink-0 text-right">
                    <p className="text-label-md text-on-surface-variant">
                      {log.sentAt ? timeAgo(log.sentAt) : '—'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
