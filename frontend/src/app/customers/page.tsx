'use client';

import React, { useState } from 'react';

import CustomerTable from '@/components/customers/CustomerTable';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { useCustomers } from '@/hooks/useCustomers';
import { Search, Filter, Plus } from 'lucide-react';

import { motion } from 'framer-motion';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { customers, loading, pagination } = useCustomers({ search, page, limit: 20 });

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        mass: 0.8,
      },
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-lg space-y-lg"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Customer Directory</h2>
          <p className="text-body-sm text-on-surface-variant mt-xs">Manage and explore your customer base</p>
        </div>
        <Button>
          <span className="material-symbols-outlined text-sm">add</span> Add Customer
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex items-center gap-md">
        <div className="relative flex-1 max-w-md group">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-sm text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-xl pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary-fixed outline-none placeholder:text-on-surface-variant/50 shadow-sm transition-all"
          />
        </div>
        <Button variant="secondary">
          <span className="material-symbols-outlined text-sm">filter_list</span> Filters
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-xl">
            <Spinner size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CustomerTable customers={customers} />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-md">
                <p className="text-body-sm text-on-surface-variant">
                  Showing {(page - 1) * 20 + 1} - {Math.min(page * 20, pagination.total)} of {pagination.total}
                </p>
                <div className="flex gap-sm">
                  <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </Button>
                  <Button variant="secondary" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
