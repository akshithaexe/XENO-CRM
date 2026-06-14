import supabase from '../config/db';
import { toCamelCase } from '../utils/mappers';
import { logger } from '../utils/logger';

/**
 * Get campaign-level analytics.
 */
export async function getCampaignAnalytics(campaignId: string) {
  // Fetch campaign with segment info
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*, segments(name, audience_count)')
    .eq('id', campaignId)
    .single();

  if (error || !campaign) throw new Error('Campaign not found');

  // Aggregate communication log statuses
  const { data: statusRows } = await supabase.rpc('count_campaign_statuses', {
    cid: campaignId,
  }).select('*');

  // Fallback: manual grouping if RPC not available
  const { data: logs } = await supabase
    .from('communication_logs')
    .select('status')
    .eq('campaign_id', campaignId);

  const stats: Record<string, number> = {};
  (logs || []).forEach((l: { status: string }) => {
    stats[l.status] = (stats[l.status] || 0) + 1;
  });

  return {
    campaign: toCamelCase(campaign),
    deliveryStats: stats,
    funnel: {
      sent: (stats['sent'] || 0) + (stats['delivered'] || 0) + (stats['opened'] || 0) + (stats['read'] || 0) + (stats['clicked'] || 0) + (stats['converted'] || 0),
      delivered: (stats['delivered'] || 0) + (stats['opened'] || 0) + (stats['read'] || 0) + (stats['clicked'] || 0) + (stats['converted'] || 0),
      opened: (stats['opened'] || 0) + (stats['read'] || 0) + (stats['clicked'] || 0) + (stats['converted'] || 0),
      read: (stats['read'] || 0) + (stats['clicked'] || 0) + (stats['converted'] || 0),
      clicked: (stats['clicked'] || 0) + (stats['converted'] || 0),
      converted: stats['converted'] || 0,
      failed: stats['failed'] || 0,
    },
  };
}

/**
 * Get overview analytics across all campaigns.
 */
export async function getOverviewAnalytics() {
  // Campaign counts
  const { count: totalCampaigns } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true });

  const { count: activeCampaigns } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'running');

  const { count: completedCampaigns } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'completed');

  const { count: totalMessages } = await supabase
    .from('communication_logs')
    .select('id', { count: 'exact', head: true });

  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true });

  const { count: totalSegments } = await supabase
    .from('segments')
    .select('id', { count: 'exact', head: true });

  // Overall delivery stats
  const { data: allLogs } = await supabase
    .from('communication_logs')
    .select('status');

  const deliveryStats: Record<string, number> = {};
  (allLogs || []).forEach((l: { status: string }) => {
    deliveryStats[l.status] = (deliveryStats[l.status] || 0) + 1;
  });

  // Channel breakdown
  const { data: channelLogs } = await supabase
    .from('communication_logs')
    .select('channel');

  const channelMap: Record<string, number> = {};
  (channelLogs || []).forEach((l: { channel: string }) => {
    channelMap[l.channel] = (channelMap[l.channel] || 0) + 1;
  });
  const channelBreakdown = Object.entries(channelMap).map(([_id, count]) => ({ _id, count }));

  // Recent campaigns
  const { data: recentCampaigns } = await supabase
    .from('campaigns')
    .select('*, segments(name, audience_count)')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalCampaigns: totalCampaigns || 0,
    activeCampaigns: activeCampaigns || 0,
    completedCampaigns: completedCampaigns || 0,
    totalMessages: totalMessages || 0,
    totalCustomers: totalCustomers || 0,
    totalSegments: totalSegments || 0,
    deliveryStats,
    channelBreakdown,
    recentCampaigns: (recentCampaigns || []).map(toCamelCase),
  };
}
