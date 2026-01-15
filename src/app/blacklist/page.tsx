'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gavel,
    Search,
    Filter,
    AlertTriangle,
    ExternalLink,
    UserX,
    Loader2,
    Check,
    X,
    ShieldAlert,
    Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function BlacklistPage() {
    const { role } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [blacklist, setBlacklist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        avgScore: 0,
        verified: 0
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let query = supabase.from('blacklist').select(`
                *,
                profiles:subject_id(email, trust_score)
            `).order('created_at', { ascending: false });

            if (role !== 'admin') {
                query = query.eq('status', 'verified');
            }

            const { data, error } = await query;
            if (error) throw error;
            setBlacklist(data || []);

            const { count: total } = await supabase.from('blacklist').select('*', { count: 'exact', head: true }).eq('status', 'verified');
            const { count: verified } = await supabase.from('blacklist').select('*', { count: 'exact', head: true }).eq('status', 'verified');

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { count: reportsToday } = await supabase.from('blacklist').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString());

            setStats({
                total: total || 0,
                today: reportsToday || 0,
                avgScore: data?.length ? Math.round(data.reduce((acc, curr) => acc + curr.trust_score, 0) / data.length) : 0,
                verified: verified || 0
            });
        } catch (err) {
            console.error('Error fetching blacklist:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (role) fetchData();
    }, [role]);

    const handleUpdateStatus = async (id: string, newStatus: 'verified' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('blacklist')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert('Gagal update status: ' + err.message);
        }
    };

    const handleToggleLanding = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('blacklist')
                .update({ show_on_landing_page: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert('Gagal update status landing: ' + err.message);
        }
    };

    const filteredList = blacklist.filter(item =>
        item.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={['admin', 'seller']}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-background text-foreground transition-colors duration-300 min-h-screen">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-dark dark:text-white tracking-tight">Database <span className="text-rose-500">Blacklist</span></h1>
                        <p className="text-dark/60 dark:text-white/60 mt-1 italic">Cek reputasi pembeli sebelum memproses pesanan paket</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari nama atau username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white dark:bg-white/5 border border-dark/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-rose-500/10 outline-none w-80 shadow-sm text-dark dark:text-white transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/30 dark:text-white/30" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="glass-card p-6 border-rose-100 dark:border-rose-500/20">
                        <p className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-1">Total Blacklisted</p>
                        <h3 className="text-4xl font-black text-rose-500">{stats.total.toLocaleString()}</h3>
                    </div>
                    <div className="glass-card p-6 md:block hidden">
                        <p className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-1">Reports Today</p>
                        <h3 className="text-4xl font-black text-dark dark:text-white">{stats.today}</h3>
                    </div>
                    <div className="glass-card p-6 bg-rose-500/5">
                        <p className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-1">Avg. Trust Score</p>
                        <h3 className="text-4xl font-black text-rose-600 dark:text-rose-400">{stats.avgScore}%</h3>
                    </div>
                    <div className="glass-card p-6">
                        <p className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-1">Verified Frauds</p>
                        <h3 className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{stats.verified.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="glass-card overflow-hidden dark:bg-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-dark/[0.02] dark:bg-white/[0.02] text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest">
                                    <th className="px-8 py-5">Subjek / User</th>
                                    <th className="px-8 py-5">Platform</th>
                                    <th className="px-8 py-5">Alasan Kejadian</th>
                                    <th className="px-8 py-5 text-center">Trust Score</th>
                                    {role === 'admin' && <th className="px-8 py-5 text-center">Landing Page</th>}
                                    <th className="px-8 py-5 text-right">Moderasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark/5 dark:divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                                                <p className="text-xs font-bold text-dark/30 dark:text-white/30 uppercase tracking-[0.2em]">Memuat Database...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-dark/30 dark:text-white/30 font-bold uppercase tracking-widest text-xs">
                                            Tidak ada data ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    filteredList.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-dark/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 ${item.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'} rounded-full flex items-center justify-center`}>
                                                        {item.status === 'pending' ? <ShieldAlert className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-dark dark:text-white">{item.subject_name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest ${item.status === 'verified' ? 'bg-rose-500 text-white' :
                                                                item.status === 'rejected' ? 'bg-dark/20 text-dark/50' :
                                                                    'bg-amber-500 text-white animate-pulse'
                                                                }`}>
                                                                {item.status}
                                                            </span>
                                                            <p className="text-[10px] text-dark/40 dark:text-white/40 font-mono">ID: {item.id?.split('-')[0]}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black bg-dark/5 dark:bg-white/10 px-3 py-1 rounded-full text-dark/70 dark:text-white/70 uppercase tracking-widest">{item.platform}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-medium text-rose-600 dark:text-rose-400 italic select-none">"{item.reason}"</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-24 h-2 bg-dark/5 dark:bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.trust_score}%` }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                            className={`h-full ${item.trust_score < 40 ? 'bg-rose-500' : 'bg-amber-500'
                                                                }`}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-bold ${item.trust_score < 40 ? 'text-rose-600' : 'text-amber-600'
                                                        }`}>{item.trust_score}%</span>
                                                </div>
                                            </td>
                                            {role === 'admin' && (
                                                <td className="px-8 py-6 text-center">
                                                    <button
                                                        onClick={() => handleToggleLanding(item.id, item.show_on_landing_page)}
                                                        className={`p-2 rounded-lg transition-all ${item.show_on_landing_page ? 'bg-primary text-white' : 'bg-dark/5 text-dark/30 hover:bg-dark/10'}`}
                                                        title="Publish to Landing Page"
                                                    >
                                                        <Globe className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            )}
                                            <td className="px-8 py-6 text-right">
                                                {role === 'admin' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(item.id, 'verified')}
                                                            disabled={item.status === 'verified'}
                                                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-emerald-500/10 disabled:hover:text-emerald-600"
                                                            title="Verifikasi"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                                            disabled={item.status === 'rejected'}
                                                            className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-rose-500/10 disabled:hover:text-rose-600"
                                                            title="Tolak"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="text-dark/40 dark:text-white/40 hover:text-rose-500 transition-colors">
                                                        <ExternalLink className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
