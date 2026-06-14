'use client';

import React from 'react';
import SegmentCard from '@/components/segments/SegmentCard';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { useSegments } from '@/hooks/useSegments';
import Link from 'next/link';

import { motion } from 'framer-motion';

export default function SegmentsPage() {
  const { segments, loading } = useSegments();

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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Audience Segments</h2>
          <p className="text-body-sm text-on-surface-variant mt-xs">Build and manage your customer segments</p>
        </div>
        <Link href="/segments/new">
          <Button>
            <span className="material-symbols-outlined text-sm">add</span> New Segment
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-xl">
            <Spinner size="lg" />
          </div>
        ) : segments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-xl bg-surface-container-lowest border border-outline-variant rounded-xl border-dashed"
          >
            <span className="material-symbols-outlined text-6xl text-outline mb-sm opacity-50">target</span>
            <h3 className="text-body-lg font-bold text-on-surface">No segments yet</h3>
            <p className="text-body-sm text-on-surface-variant mt-xs mb-md">Create your first audience segment</p>
            <Link href="/segments/new">
              <Button><span className="material-symbols-outlined text-sm">add</span> Create Segment</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-lg"
          >
            {segments.map((s) => (
              <SegmentCard key={s.id} segment={s} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
