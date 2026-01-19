'use client';

import React, { useEffect, useState } from 'react';
import StatsCards from '@/components/StatsCards';
import RecordAction from '@/components/RecordAction';
import BlacklistCard from '@/components/BlacklistCard';
import OnboardingTour from '@/components/OnboardingTour';
import { Package, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  const { user } = useAuth();
  const [userName, setUserName] = useState('Seller');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('shop_name, email')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserName(data.shop_name || data.email?.split('@')[0] || 'Seller');
      }
    };
    fetchUserProfile();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <div className="max-w-7xl mx-auto px-6 py-12 bg-[var(--background)] min-h-screen">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[var(--color-text-main)] mb-2">
              Selamat Datang, <span className="text-[var(--primary)]">{userName}</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--color-text-muted)]">Status Toko:</span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full text-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> Terlindungi
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--background)] transition-colors text-[var(--color-text-main)]">
              <Package className="w-4 h-4 text-[var(--color-text-muted)]" /> Riwayat Paket
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--background)] transition-colors text-[var(--color-text-main)]">
              <HelpCircle className="w-4 h-4 text-[var(--color-text-muted)]" /> Bantuan
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          <div className="lg:col-span-7">
            <RecordAction />
          </div>
          <div className="lg:col-span-5">
            <BlacklistCard />
          </div>
        </div>

        <OnboardingTour />
      </div>
    </ProtectedRoute>
  );
}
