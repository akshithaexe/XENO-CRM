'use client';

import React from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  amount: number;
  date: string;
  channel: string;
  status: string;
}

interface OrderHistoryTableProps {
  orders: Order[];
}

export default function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const statusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success' as const;
      case 'pending': return 'warning' as const;
      case 'cancelled': return 'danger' as const;
      case 'refunded': return 'purple' as const;
      default: return 'default' as const;
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (o: Order) => formatDate(o.date),
    },
    {
      key: 'items',
      label: 'Items',
      render: (o: Order) => (
        <span>{o.items.map((i) => i.name).join(', ')}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (o: Order) => <span className="font-semibold">{formatCurrency(o.amount)}</span>,
    },
    {
      key: 'channel',
      label: 'Channel',
      render: (o: Order) => <Badge variant="info">{o.channel}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (o: Order) => <Badge variant={statusVariant(o.status)}>{o.status}</Badge>,
    },
  ];

  return <Table columns={columns} data={orders} emptyMessage="No orders found" />;
}
