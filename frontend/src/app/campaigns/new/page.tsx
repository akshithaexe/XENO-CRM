'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import CampaignForm from '@/components/campaigns/CampaignForm';
import { createCampaign, fetchSegments } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCampaignPage() {
  const router = useRouter();
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSegments()
      .then((res) => setSegments(res.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await createCampaign(data);
      router.push('/campaigns');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar title="New Campaign" />

      <div className="p-8 space-y-6 animate-fade-in max-w-3xl">
        <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </Link>

        <div>
          <h2 className="text-2xl font-bold text-surface-900">Create New Campaign</h2>
          <p className="text-surface-500 mt-1">Set up and configure your marketing campaign</p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 p-6">
          <CampaignForm segments={segments} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
