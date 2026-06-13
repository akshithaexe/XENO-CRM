import axios from 'axios';
import supabase from '../config/db';
import { evaluateSegment } from './segmentEngine';
import { logger } from '../utils/logger';

const CHANNEL_SERVICE_URL = process.env.CHANNEL_SERVICE_URL || 'http://localhost:5001';

/**
 * Dispatches a campaign: evaluates the segment, fans out messages to the channel service.
 */
export async function dispatchCampaign(campaignId: string): Promise<void> {
  try {
    // Fetch campaign
    const { data: campaign, error: cErr } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();
    if (cErr || !campaign) throw new Error(`Campaign ${campaignId} not found`);

    // Fetch segment
    const { data: segment, error: sErr } = await supabase
      .from('segments')
      .select('*')
      .eq('id', campaign.segment_id)
      .single();
    if (sErr || !segment) throw new Error(`Segment ${campaign.segment_id} not found`);

    // Update status to running
    await supabase
      .from('campaigns')
      .update({ status: 'running' })
      .eq('id', campaignId);

    // Evaluate segment to get target customers
    const { customerIds } = await evaluateSegment(segment.rules);

    logger.info(`Dispatching campaign ${campaignId} to ${customerIds.length} customers`);

    // Fan out: send a message for each recipient via the channel service
    let sentCount = 0;
    for (const customerId of customerIds) {
      try {
        // Create a communication log entry
        const { data: log, error: logErr } = await supabase
          .from('communication_logs')
          .insert({
            campaign_id: campaignId,
            customer_id: customerId,
            channel: campaign.channel,
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (logErr || !log) throw logErr || new Error('Failed to create log');

        // Call the channel service
        await axios.post(`${CHANNEL_SERVICE_URL}/send`, {
          campaignId,
          customerId,
          logId: log.id,
          channel: campaign.channel,
          message: campaign.message,
        });

        sentCount++;
      } catch (err) {
        logger.error(`Failed to send to customer ${customerId}:`, err);

        await supabase.from('communication_logs').insert({
          campaign_id: campaignId,
          customer_id: customerId,
          channel: campaign.channel,
          status: 'failed',
          sent_at: new Date().toISOString(),
          failure_reason: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    // Update campaign stats
    const newStats = {
      ...campaign.stats,
      sent: sentCount,
      failed: customerIds.length - sentCount,
    };

    await supabase
      .from('campaigns')
      .update({
        stats: newStats,
        status: sentCount === 0 ? 'failed' : campaign.status,
      })
      .eq('id', campaignId);

    logger.info(`Campaign ${campaignId} dispatched: ${sentCount}/${customerIds.length} sent`);
  } catch (error) {
    logger.error(`Campaign dispatch error for ${campaignId}:`, error);
    await supabase.from('campaigns').update({ status: 'failed' }).eq('id', campaignId);
    throw error;
  }
}
