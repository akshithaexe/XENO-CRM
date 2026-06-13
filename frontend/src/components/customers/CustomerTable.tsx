'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { Customer } from '@/types/customer';
import { formatCurrency, formatDate } from '@/lib/utils';

interface CustomerTableProps {
  customers: Customer[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  const router = useRouter();

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (c: Customer) => (
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center text-primary font-bold text-xs">
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-body-sm text-on-surface">{c.name}</p>
            <p className="text-label-md text-on-surface-variant">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone' },
    {
      key: 'totalSpend',
      label: 'Total Spend',
      render: (c: Customer) => <span className="font-bold text-on-surface">{formatCurrency(c.totalSpend)}</span>,
    },
    {
      key: 'visitCount',
      label: 'Visits',
      render: (c: Customer) => <span>{c.visitCount}</span>,
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (c: Customer) => (
        <div className="flex flex-wrap gap-1">
          {c.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="info">{tag}</Badge>
          ))}
          {c.tags.length > 3 && <Badge variant="default">+{c.tags.length - 3}</Badge>}
        </div>
      ),
    },
    {
      key: 'lastVisit',
      label: 'Last Visit',
      render: (c: Customer) => c.lastVisit ? formatDate(c.lastVisit) : '—',
    },
  ];

  return (
    <Table
      columns={columns}
      data={customers}
      onRowClick={(c) => router.push(`/customers/${c.id}`)}
      emptyMessage="No customers found"
    />
  );
}
