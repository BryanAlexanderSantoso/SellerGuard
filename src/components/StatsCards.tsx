'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const StatsCards = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            try {
                // 1. Total Protected (Total Orders)
                const { count: totalOrders } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('seller_id', user.id);

                // 2. Ongoing Disputes
                const { count: ongoingDisputes } = await supabase
                    .from('disputes')
                    .select('*', { count: 'exact', head: true })
                    .in('status', ['pending', 'in_review']);

                // 3. Saved Revenue (Sum of prices of delivered/shipped orders)
                const { data: revenueData } = await supabase
                    .from('orders')
                    .select('price')
                    .eq('seller_id', user.id);

                const totalRevenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;

                // 4. Fraud Attempts (Verified blacklist reports globally or specific to user)
                const { count: fraudAttempts } = await supabase
                    .from('blacklist')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'verified');

                setStats([
                    {
                        label: 'Total Protected',
                        value: totalOrders?.toLocaleString() || '0',
                        icon: ShieldCheck,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-50',
                        trend: '+12% this month'
                    },
                    {
                        label: 'Ongoing Disputes',
                        value: ongoingDisputes?.toString() || '0',
                        icon: Clock,
                        color: 'text-amber-600',
                        bg: 'bg-amber-50',
                        trend: 'Needs review'
                    },
                    {
                        label: 'Saved Revenue',
                        value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`,
                        icon: TrendingUp,
                        color: 'text-blue-600',
                        bg: 'bg-blue-50',
                        trend: 'Protected'
                    },
                    {
                        label: 'Fraud Attempts',
                        value: fraudAttempts?.toString() || '0',
                        icon: AlertTriangle,
                        color: 'text-rose-600',
                        bg: 'bg-rose-50',
                        trend: 'Alerts'
                    }
                ]);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="claude-card p-6 h-28 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin opacity-50" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="claude-card p-6 flex flex-col justify-between h-32 hover:border-[var(--primary)] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{stat.label}</span>
                        <div className={`p-1.5 rounded-md ${stat.bg}`}>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-medium text-[var(--color-text-main)] mb-1">{stat.value}</h3>
                        <p className={`text-xs ${stat.color} opacity-90 font-medium`}>{stat.trend}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
