export interface ChannelBreakdownData {
  _id: string;
  count: number;
}

export interface DeliveryStats {
  sent?: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
  failed?: number;
}

export interface OverviewAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalMessages: number;
  totalCustomers: number;
  totalSegments: number;
  deliveryStats: DeliveryStats;
  channelBreakdown: ChannelBreakdownData[];
  recentCampaigns: any[];
}
