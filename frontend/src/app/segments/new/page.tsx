'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import SegmentRuleBuilder from '@/components/segments/SegmentRuleBuilder';
import SegmentPreview from '@/components/segments/SegmentPreview';
import AISuggestSegment from '@/components/segments/AISuggestSegment';
import Button from '@/components/ui/Button';
import { createSegment } from '@/lib/api';
import { SegmentRuleGroup } from '@/types/segment';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewSegmentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState<SegmentRuleGroup>({ logic: 'AND', conditions: [] });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || rules.conditions.length === 0) return;
    setSaving(true);
    try {
      await createSegment({ name, description, rules });
      router.push('/segments');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar title="New Segment" />

      <div className="p-8 space-y-6 animate-fade-in max-w-4xl">
        <Link href="/segments" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Segments
        </Link>

        <div>
          <h2 className="text-2xl font-bold text-surface-900">Create New Segment</h2>
          <p className="text-surface-500 mt-1">Define rules to target specific customer groups</p>
        </div>

        {/* Name and Description */}
        <div className="space-y-4 bg-white rounded-2xl border border-surface-200 p-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Segment Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., High-Value Customers"
              className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this segment..."
              className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm resize-none h-20 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        {/* AI Suggestion */}
        <AISuggestSegment onSuggestion={setRules} />

        {/* Rule Builder */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6">
          <h3 className="font-semibold text-surface-900 mb-4">Segment Rules</h3>
          <SegmentRuleBuilder rules={rules} onChange={setRules} />
        </div>

        {/* Preview */}
        <SegmentPreview audienceCount={0} />

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleSubmit} loading={saving} size="lg">
            <Save className="w-4 h-4" /> Save Segment
          </Button>
          <Link href="/segments">
            <Button variant="secondary" size="lg">Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
