import React from 'react';
import { Customer } from '@/types/customer';
import Badge from '@/components/ui/Badge';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-500/20">
          {customer.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-900">{customer.name}</h2>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {customer.tags.map((tag) => (
              <Badge key={tag} variant="info">{tag}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 text-sm text-surface-600">
          <Mail className="w-4 h-4 text-surface-400" />
          {customer.email}
        </div>
        <div className="flex items-center gap-3 text-sm text-surface-600">
          <Phone className="w-4 h-4 text-surface-400" />
          {customer.phone || '—'}
        </div>
        <div className="flex items-center gap-3 text-sm text-surface-600">
          <ShoppingBag className="w-4 h-4 text-surface-400" />
          {formatCurrency(customer.totalSpend)} spent
        </div>
        <div className="flex items-center gap-3 text-sm text-surface-600">
          <Calendar className="w-4 h-4 text-surface-400" />
          {customer.lastVisit ? timeAgo(customer.lastVisit) : 'Never'}
        </div>
      </div>
    </div>
  );
}
