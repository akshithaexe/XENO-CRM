'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCampaigns, fetchCampaignById } from '@/lib/api';
import { Campaign } from '@/types/campaign';

export function useCampaigns(params?: Record<string, any>) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCampaigns(params);
      setCampaigns(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  return { campaigns, loading, error, refetch: load };
}

export function useCampaign(id: string) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCampaignById(id)
      .then((res) => setCampaign(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { campaign, loading, error };
}
