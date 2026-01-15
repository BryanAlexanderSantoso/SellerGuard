'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    ShieldCheck,
    Clock,
    AlertCircle,
    Search,
    Camera,
    History,
    ChevronRight,
    ArrowUpRight,
    Box
} from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function BuyerDashboard() {
    const { user } = useAuth();
    const [searchId, setSearchId] = useState('');
    const [mounted, setMounted] = useState(false);
    const [activeDisputesCount, setActiveDisputesCount] = useState(0);
    const [trustScore, setTrustScore] = useState(100);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [totalReceived, setTotalReceived] = useState(0);
    const [totalUnboxing, setTotalUnboxing] = useState(0);

    const getTrustLevel = (score: number) => {
        if (score >= 90) return 'Elite';
        if (score >= 70) return 'Trusted';
        if (score >= 50) return 'Safe';
        return 'Risky';
    };

    const stats = [
        { label: 'Paket Diterima', value: totalReceived.toString(), icon: Box, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Unboxing Rekam', value: totalUnboxing.toString(), icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Sengketa Aktif', value: activeDisputesCount.toString(), icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Trust Level', value: `${trustScore}% (${getTrustLevel(trustScore)})`, icon: ShieldCheck, color: trustScore >= 70 ? 'text-purple-500' : 'text-rose-500', bg: trustScore >= 70 ? 'bg-purple-500/10' : 'bg-rose-500/10' },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Baru saja';
        if (diffInHours < 24) return `${Math.floor(diffInHours)} Jam Lalu`;
        if (diffInHours < 48) return 'Kemarin';
        return `${Math.floor(diffInHours / 24)} Hari Lalu`;
    };

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    useEffect(() => {
        setMounted(true);
        const fetchStats = async () => {
            if (!user) return;

            // Fetch Disputes
            const { count } = await supabase
                .from('disputes')
                .select('*', { count: 'exact', head: true })
                .eq('buyer_id', user.id)
                .in('status', ['pending', 'in_review']);

            if (count !== null) setActiveDisputesCount(count);

            // Fetch Trust Score from Profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('trust_score')
                .eq('id', user.id)
                .single();

            if (profile?.trust_score !== undefined) setTrustScore(profile.trust_score);

            // Fetch Recent Orders (assuming buyer_email matches user email)
            const { data: ordersData } = await supabase
                .from('orders')
                .select('*')
                .eq('buyer_email', user.email)
                .order('created_at', { ascending: false })
                .limit(5);

            if (ordersData) {
                setRecentOrders(ordersData.map((order: any) => ({
                    id: order.tracking_number,
                    store: order.product_name || 'Toko Online',
                    status: order.status === 'delivered' ? 'Diterima' :
                        order.status === 'shipped' ? 'Dalam Perjalanan' :
                            order.status === 'disputed' ? 'Verifikasi Unboxing' : 'Pending',
                    date: formatDate(order.created_at),
                    amount: formatPrice(order.price || 0)
                })));

                // Count delivered orders
                const deliveredCount = ordersData.filter((o: any) => o.status === 'delivered').length;
                setTotalReceived(deliveredCount);
            }

            // Fetch Unboxing Evidence Count
            const { count: unboxingCount } = await supabase
                .from('evidences')
                .select('*', { count: 'exact', head: true })
                .eq('type', 'unboxing')
                .in('order_id', ordersData?.map((o: any) => o.id) || []);

            if (unboxingCount !== null) setTotalUnboxing(unboxingCount);
        };
        fetchStats();
    }, [user]);

    if (!mounted) return null;

    return (
        <ProtectedRoute allowedRoles={['buyer']}>
            <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-dark dark:text-white tracking-tight">
                                Halo, <span className="text-primary">{user?.email?.split('@')[0]}</span> 👋
                            </h1>
                            <p className="text-dark/50 dark:text-white/50 font-medium">
                                Dashboard Belanja Aman & Bukti Digital
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-dark/10 dark:border-white/10 rounded-2xl font-bold hover:bg-dark/[0.02] transition-all">
                                <History className="w-5 h-5 text-primary" />
                                Riwayat Belanja
                            </button>
                        </div>
                    </div>

                    {/* Quick Search */}
                    <div className="glass-card p-6 bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <h2 className="text-xl font-bold text-dark dark:text-white">Verifikasi Paket Baru?</h2>
                                <p className="text-sm text-dark/60 dark:text-white/60 font-medium">Masukkan nomor resi atau SG-ID untuk merekam unboxing</p>
                            </div>
                            <div className="w-full md:w-[400px] relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/30 dark:text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Contoh: SG-12345..."
                                    className="w-full pl-12 pr-24 py-4 rounded-2xl bg-white dark:bg-black/20 border border-dark/10 dark:border-white/10 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                                <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
                                    Cek
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6"
                            >
                                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <p className="text-sm font-bold text-dark/50 dark:text-white/50">{stat.label}</p>
                                <p className="text-2xl font-black text-dark dark:text-white mt-1">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Transaction List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-xl font-bold text-dark dark:text-white flex items-center gap-2">
                                    <Clock className="text-primary w-5 h-5" />
                                    Belanja Terbaru
                                </h3>
                                <button className="text-sm font-bold text-primary hover:underline">Lihat Semua</button>
                            </div>

                            <div className="space-y-4">
                                {recentOrders.length === 0 ? (
                                    <div className="glass-card p-12 text-center">
                                        <Package className="w-12 h-12 text-dark/20 dark:text-white/20 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest">
                                            Belum ada pesanan
                                        </p>
                                    </div>
                                ) : (
                                    recentOrders.map((order, i) => (
                                        <div key={order.id} className="glass-card p-5 group hover:border-primary/30 transition-all cursor-pointer">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-dark/[0.03] dark:bg-white/[0.03] rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                        <Package className="w-6 h-6 text-dark/40 dark:text-white/40 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-black text-dark dark:text-white">{order.id}</span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${order.status === 'Diterima' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                order.status === 'Dalam Perjalanan' ? 'bg-blue-500/10 text-blue-500' :
                                                                    'bg-purple-500/10 text-purple-500'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-dark/40 dark:text-white/40 mt-0.5">{order.store} • {order.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-dark dark:text-white">{order.amount}</p>
                                                    <div className="flex items-center gap-1 text-xs font-bold text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Detail <ChevronRight className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Side Cards */}
                        <div className="space-y-6">
                            <div className="glass-card p-6 bg-primary text-white space-y-4 relative overflow-hidden">
                                <ShieldCheck className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
                                <h3 className="text-xl font-bold">Lindungi Belanjamu</h3>
                                <p className="text-sm text-white/80 leading-relaxed font-medium">
                                    Jangan lupa rekam video unboxing tanpa jeda untuk setiap paket yang Anda terima. Ini bukti terkuat Anda jika terjadi masalah.
                                </p>
                                <button className="w-full py-3 bg-white text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all">
                                    Cara Rekam Bukti <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="glass-card p-6 space-y-4 border-dashed border-2">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-amber-500 w-6 h-6" />
                                    <h4 className="font-bold text-dark dark:text-white">Punya Kendala Paket?</h4>
                                </div>
                                <p className="text-sm text-dark/50 dark:text-white/50 font-medium"> Ajukan sengketa secara resmi ke Admin jika barang tidak sesuai atau rusak.</p>
                                <Link href="/buyer/dispute/new" className="w-full py-3 border border-dark/10 dark:border-white/10 font-bold rounded-xl hover:bg-dark/[0.02] transition-all flex items-center justify-center">
                                    Ajukan Dispute
                                </Link>
                                {activeDisputesCount > 0 && (
                                    <Link href="/buyer/disputes" className="block text-center text-xs font-bold text-primary hover:underline">
                                        Lihat {activeDisputesCount} Sengketa Aktif Anda
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
