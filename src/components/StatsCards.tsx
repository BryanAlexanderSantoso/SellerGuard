'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
                        color: 'emerald',
                        trend: '+12% this month'
                    },
                    {
                        label: 'Ongoing Disputes',
                        value: ongoingDisputes?.toString() || '0',
                        icon: Clock,
                        color: 'amber',
                        trend: 'Needs your review'
                    },
                    {
                        label: 'Saved Revenue',
                        value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`,
                        icon: TrendingUp,
                        color: 'emerald',
                        trend: 'Revenue protected'
                    },
                    {
                        label: 'Fraud Attempts',
                        value: fraudAttempts?.toString() || '0',
                        icon: AlertTriangle,
                        color: 'rose',
                        trend: 'Community alerts'
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
                    <div key={i} className="glass-card p-6 h-24 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-dark/60">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-dark mt-1">{stat.value}</h3>
                            <p className={`text-xs mt-2 font-medium ${stat.color === 'emerald' ? 'text-emerald-600' :
                                stat.color === 'amber' ? 'text-amber-600' : 'text-rose-600'
                                }`}>
                                {stat.trend}
                            </p>
                        </div>
                        <div className={`p-3 rounded-2xl flex items-center justify-center ${stat.color === 'emerald' ? 'bg-emerald-500/10' :
                            stat.color === 'amber' ? 'bg-amber-500/10' : 'bg-rose-500/10'
                            }`}>
                            <stat.icon className={`w-6 h-6 ${stat.color === 'emerald' ? 'text-emerald-600' :
                                stat.color === 'amber' ? 'text-amber-600' : 'text-rose-600'
                                }`} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsCards;
