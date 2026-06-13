export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
}

export interface Campaign {
  id: string;
  name: string;
  segment_id: string;
  message: string;
  channel: 'whatsapp' | 'sms' | 'email' | 'rcs';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'failed';
  scheduled_at: string | null;
  completed_at: string | null;
  stats: CampaignStats;
  created_at: string;
  updated_at: string;
}

export const CAMPAIGN_WRITABLE_FIELDS = [
  'name', 'segment_id', 'message', 'channel',
  'status', 'scheduled_at', 'completed_at', 'stats',
];
