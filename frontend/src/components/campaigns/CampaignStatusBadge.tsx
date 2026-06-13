import React from 'react';
import Badge from '@/components/ui/Badge';

interface CampaignStatusBadgeProps {
  status: string;
}

export default function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'> = {
    draft: 'default',
    scheduled: 'info',
    running: 'warning',
    completed: 'success',
    paused: 'purple',
    failed: 'danger',
  };

  return (
    <Badge variant={variants[status] || 'default'} size="md">
      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'running' ? 'bg-[#ba1a1a] animate-pulse' : 
        status === 'completed' ? 'bg-success-on-container' :
        status === 'failed' ? 'bg-error' : 'bg-current'
      }`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
