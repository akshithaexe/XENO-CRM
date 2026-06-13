import supabase from '../config/db';
import { logger } from '../utils/logger';

interface ReceiptPayload {
  logId: string;
  campaignId: string;
  customerId: string;
  status: 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  timestamp: string;
  failureReason?: string;
}

/**
 * Processes incoming delivery receipts from the channel service.
 * Updates communication logs and campaign stats.
 */
export async function processReceipt(payload: ReceiptPayload): Promise<void> {
  const { logId, campaignId, status, timestamp, failureReason } = payload;

  try {
    // Build the update fields for the communication log
    const updateFields: Record<string, any> = { status };

    switch (status) {
      case 'delivered':
        updateFields.delivered_at = timestamp;
        break;
      case 'opened':
        updateFields.opened_at = timestamp;
        break;
      case 'clicked':
        updateFields.clicked_at = timestamp;
        break;
      case 'failed':
      case 'bounced':
        updateFields.failure_reason = failureReason || 'Unknown';
        break;
    }

    // Update the communication log
    await supabase
      .from('communication_logs')
      .update(updateFields)
      .eq('id', logId);

    // Update campaign stats — fetch current stats, increment the right counter
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('stats, status')
      .eq('id', campaignId)
      .single();

    if (campaign) {
      const currentStats = campaign.stats || {};
      const newStats = {
        ...currentStats,
        [status]: (currentStats[status] || 0) + 1,
      };

      const updateData: Record<string, any> = { stats: newStats };

      // Check if campaign is complete (no pending 'sent' logs remain)
      const { count } = await supabase
        .from('communication_logs')
        .select('id', { count: 'exact', head: true })
        .eq('campaign_id', campaignId)
        .eq('status', 'sent');

      if ((count || 0) === 0 && campaign.status === 'running') {
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();
        logger.info(`Campaign ${campaignId} completed`);
      }

      await supabase.from('campaigns').update(updateData).eq('id', campaignId);
    }

    logger.debug(`Receipt processed: log=${logId}, status=${status}`);
  } catch (error) {
    logger.error('Error processing receipt:', error);
    throw error;
  }
}
