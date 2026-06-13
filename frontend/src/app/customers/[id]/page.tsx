'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import CustomerCard from '@/components/customers/CustomerCard';
import OrderHistoryTable from '@/components/customers/OrderHistoryTable';
import Spinner from '@/components/ui/Spinner';
import { useCustomer } from '@/hooks/useCustomers';
import { fetchOrdersByCustomer } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { customer, loading } = useCustomer(id);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrdersByCustomer(id)
        .then((res) => setOrders(res.data))
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 text-center text-surface-500">Customer not found</div>
    );
  }

  return (
    <div>
      <Navbar title="Customer Detail" />

      <div className="p-8 space-y-6 animate-fade-in">
        <Link href="/customers" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>

        <CustomerCard customer={customer} />

        <div>
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Order History</h3>
          {ordersLoading ? (
            <Spinner className="py-10" />
          ) : (
            <OrderHistoryTable orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
}
