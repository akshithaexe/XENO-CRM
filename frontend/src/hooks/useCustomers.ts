'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCustomers, fetchCustomerById } from '@/lib/api';
import { Customer } from '@/types/customer';

export function useCustomers(params?: Record<string, any>) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCustomers(params);
      setCustomers(res.data);
      if (res.pagination) setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  return { customers, loading, error, pagination, refetch: load };
}

export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCustomerById(id)
      .then((res) => setCustomer(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { customer, loading, error };
}
