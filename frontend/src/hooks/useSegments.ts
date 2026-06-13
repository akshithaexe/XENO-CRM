'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchSegments, fetchSegmentById } from '@/lib/api';
import { Segment } from '@/types/segment';

export function useSegments() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSegments();
      setSegments(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load segments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { segments, loading, error, refetch: load };
}

export function useSegment(id: string) {
  const [segment, setSegment] = useState<Segment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchSegmentById(id)
      .then((res) => setSegment(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { segment, loading, error };
}
