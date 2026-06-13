export interface CommunicationLog {
  id: string;
  campaign_id: string;
  customer_id: string;
  channel: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  sent_at: string;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}
