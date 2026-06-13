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
  segmentId: string | { id: string; name: string; audienceCount: number };
  message: string;
  channel: 'whatsapp' | 'sms' | 'email' | 'rcs';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'failed';
  scheduledAt?: string;
  completedAt?: string;
  stats: CampaignStats;
  createdAt: string;
  updatedAt: string;
}
