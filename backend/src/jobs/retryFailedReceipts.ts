import cron from 'node-cron';
import supabase from '../config/db';
import { logger } from '../utils/logger';

/**
 * Retry logic for messages that are stuck in 'sent' status
 * (no delivery callback received within a timeout window).
 * Runs every 5 minutes.
 */
export function startRetryJob(): void {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const timeoutThreshold = new Date(Date.now() - 10 * 60 * 1000).toISOString();

      const { data: stuckLogs, error } = await supabase
        .from('communication_logs')
        .select('id, campaign_id')
        .eq('status', 'sent')
        .lt('sent_at', timeoutThreshold)
        .limit(100);

      if (error || !stuckLogs || stuckLogs.length === 0) return;

      logger.info(`Found ${stuckLogs.length} stuck communication logs, marking as failed`);

      for (const log of stuckLogs) {
        await supabase
          .from('communication_logs')
          .update({ status: 'failed', failure_reason: 'Delivery callback timeout' })
          .eq('id', log.id);

        // Update campaign stats
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('stats')
          .eq('id', log.campaign_id)
          .single();

        if (campaign) {
          const newStats = { ...campaign.stats, failed: (campaign.stats.failed || 0) + 1 };
          await supabase.from('campaigns').update({ stats: newStats }).eq('id', log.campaign_id);
        }
      }

      logger.info(`Processed ${stuckLogs.length} stuck logs`);
    } catch (error) {
      logger.error('Retry job error:', error);
    }
  });

  logger.info('Retry failed receipts job scheduled (every 5 minutes)');
}
