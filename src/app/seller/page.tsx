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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-colors duration-300 min-h-screen">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-dark tracking-tight">
              Selamat Datang, <span className="text-primary">{userName}</span>!
            </h1>
            <p className="text-dark/60 mt-1 flex items-center gap-2">
              Status Toko: <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                <ShieldCheck className="w-3 h-3" /> Terlindungi
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-dark/10 rounded-xl text-sm font-semibold hover:bg-dark/[0.02] transition-colors">
              <Package className="w-4 h-4" /> Riwayat Paket
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-dark/10 rounded-xl text-sm font-semibold hover:bg-dark/[0.02] transition-colors">
              <HelpCircle className="w-4 h-4" /> Bantuan
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

        {/* Tutorial Trigger Tooltip (Optional placeholder for user) */}
        <OnboardingTour />
      </div>
    </ProtectedRoute>
  );
}
