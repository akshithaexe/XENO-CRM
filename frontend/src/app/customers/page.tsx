'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import CustomerTable from '@/components/customers/CustomerTable';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { useCustomers } from '@/hooks/useCustomers';
import { createCustomer } from '@/lib/api';

import { motion, AnimatePresence } from 'framer-motion';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [tags, setTags] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const { customers, loading, pagination, refetch } = useCustomers({
    search, page, limit: 20, sortBy, order, ...(tags ? { tags } : {}),
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '', email: '', phone: '', tags: '',
  });

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      await createCustomer({
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone || undefined,
        tags: newCustomer.tags ? newCustomer.tags.split(',').map(t => t.trim()) : [],
      });
      setShowAddModal(false);
      setNewCustomer({ name: '', email: '', phone: '', tags: '' });
      refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || 'Failed to add customer';
      setAddError(msg);
    } finally {
      setAddLoading(false);
    }
  };

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

  const mainContent = (
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
        <Button onClick={() => setShowAddModal(true)}>
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
        <div className="relative">
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
            <span className="material-symbols-outlined text-sm">filter_list</span> Filters
            {(tags || sortBy !== 'created_at' || order !== 'desc') && (
              <span className="w-2 h-2 bg-primary rounded-full ml-xs" />
            )}
          </Button>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilters(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-sm w-72 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 p-md space-y-md"
                >
                  <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Sort By</h4>
                  <div className="grid grid-cols-2 gap-xs">
                    {[
                      { label: 'Date Added', value: 'created_at' },
                      { label: 'Name', value: 'name' },
                      { label: 'Total Spend', value: 'total_spend' },
                      { label: 'Visit Count', value: 'visit_count' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setPage(1); }}
                        className={`px-sm py-xs text-label-md rounded-md transition-colors ${
                          sortBy === opt.value
                            ? 'bg-secondary-fixed text-on-secondary-fixed font-bold'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Order</h4>
                  <div className="flex gap-xs">
                    <button
                      onClick={() => { setOrder('desc'); setPage(1); }}
                      className={`flex-1 px-sm py-xs text-label-md rounded-md transition-colors ${
                        order === 'desc' ? 'bg-secondary-fixed text-on-secondary-fixed font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      Descending
                    </button>
                    <button
                      onClick={() => { setOrder('asc'); setPage(1); }}
                      className={`flex-1 px-sm py-xs text-label-md rounded-md transition-colors ${
                        order === 'asc' ? 'bg-secondary-fixed text-on-secondary-fixed font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      Ascending
                    </button>
                  </div>

                  <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Tags</h4>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => { setTags(e.target.value); setPage(1); }}
                    placeholder="e.g. vip, loyal"
                    className="w-full px-sm py-xs bg-surface-container-lowest border border-outline-variant rounded-md text-body-sm text-on-surface focus:ring-2 focus:ring-secondary-fixed outline-none"
                  />

                  <div className="flex justify-between pt-xs border-t border-outline-variant">
                    <button
                      onClick={() => { setSortBy('created_at'); setOrder('desc'); setTags(''); setPage(1); }}
                      className="text-label-md text-on-surface-variant hover:text-error font-bold transition-colors"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-label-md text-primary font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
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

  const addCustomerModal = showAddModal && typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-2xl border border-outline-variant shadow-2xl p-lg max-w-md w-full mx-md"
          >
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person_add</span>
              </div>
              <h3 className="text-body-lg font-bold text-on-surface">Add New Customer</h3>
            </div>

            {addError && (
              <div className="mb-md p-sm bg-error-container rounded-lg text-error text-body-sm">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddCustomer} className="space-y-md">
              <div>
                <label className="block text-label-md font-bold text-on-surface-variant mb-xs">Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-md text-body-sm text-on-surface focus:ring-2 focus:ring-secondary-fixed outline-none"
                />
              </div>
              <div>
                <label className="block text-label-md font-bold text-on-surface-variant mb-xs">Email *</label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-md text-body-sm text-on-surface focus:ring-2 focus:ring-secondary-fixed outline-none"
                />
              </div>
              <div>
                <label className="block text-label-md font-bold text-on-surface-variant mb-xs">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-md text-body-sm text-on-surface focus:ring-2 focus:ring-secondary-fixed outline-none"
                />
              </div>
              <div>
                <label className="block text-label-md font-bold text-on-surface-variant mb-xs">Tags</label>
                <input
                  type="text"
                  value={newCustomer.tags}
                  onChange={(e) => setNewCustomer({ ...newCustomer, tags: e.target.value })}
                  placeholder="vip, loyal (comma-separated)"
                  className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-md text-body-sm text-on-surface focus:ring-2 focus:ring-secondary-fixed outline-none"
                />
              </div>

              <div className="flex items-center gap-sm justify-end pt-sm">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-md py-sm text-body-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" loading={addLoading}>
                  <span className="material-symbols-outlined text-sm">add</span> Add Customer
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <>
      {mainContent}
      {addCustomerModal}
    </>
  );
}

