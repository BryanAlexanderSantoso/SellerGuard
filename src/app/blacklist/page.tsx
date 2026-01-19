'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Gavel,
    Search,
    UserX,
    Loader2,
    Check,
    X,
    ShieldAlert,
    Globe,
    AlertCircle,
    User
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
            <div className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-serif font-medium text-[var(--color-text-main)]">Database Blacklist</h1>
                            <p className="text-[var(--color-text-muted)] mt-2">Cek reputasi pembeli sebelum memproses pesanan paket</p>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari nama atau username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-80 pl-10 pr-4 py-2.5 bg-white border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all text-sm text-[var(--color-text-main)] shadow-sm"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                        </div>
                    </div>

                    {/* StatsGrid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="claude-card p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-rose-50 rounded-lg">
                                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                                </div>
                                <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Total Blacklisted</p>
                            </div>
                            <h3 className="text-3xl font-serif font-medium text-[var(--color-text-main)]">{stats.total.toLocaleString()}</h3>
                        </div>

                        <div className="claude-card p-6 md:block hidden">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                                    <Gavel className="w-5 h-5 text-[var(--color-text-main)]" />
                                </div>
                                <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Reports Today</p>
                            </div>
                            <h3 className="text-3xl font-serif font-medium text-[var(--color-text-main)]">{stats.today}</h3>
                        </div>

                        <div className="claude-card p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-amber-600" />
                                </div>
                                <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Avg. Trust Score</p>
                            </div>
                            <h3 className="text-3xl font-serif font-medium text-[var(--color-text-main)]">{stats.avgScore}%</h3>
                        </div>

                        <div className="claude-card p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Check className="w-5 h-5 text-emerald-600" />
                                </div>
                                <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Verified Frauds</p>
                            </div>
                            <h3 className="text-3xl font-serif font-medium text-[var(--color-text-main)]">{stats.verified.toLocaleString()}</h3>
                        </div>
                    </div>

                    {/* Content Table */}
                    <div className="claude-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                                        <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest leading-relaxed">Subjek / User</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest leading-relaxed">Platform</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest leading-relaxed">Alasan</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest leading-relaxed text-center">Trust Score</th>
                                        {role === 'admin' && <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest leading-relaxed text-center">Landing Page</th>}
                                        <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest leading-relaxed text-right">Moderasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-6 h-6 text-[var(--color-text-muted)] animate-spin" />
                                                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Memuat Database...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredList.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-60">
                                                    <UserX className="w-8 h-8 text-[var(--color-text-muted)]" />
                                                    <p className="text-sm font-medium text-[var(--color-text-muted)]">Tidak ada data ditemukan</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredList.map((item, index) => (
                                            <motion.tr
                                                key={item.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group hover:bg-[var(--background)] transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.status === 'pending'
                                                                ? 'bg-amber-50 border-amber-100 text-amber-600'
                                                                : 'bg-rose-50 border-rose-100 text-rose-600'
                                                            }`}>
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-[var(--color-text-main)]">{item.subject_name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${item.status === 'verified' ? 'bg-rose-100 text-rose-700' :
                                                                        item.status === 'rejected' ? 'bg-gray-100 text-gray-500' :
                                                                            'bg-amber-100 text-amber-700'
                                                                    }`}>
                                                                    {item.status}
                                                                </span>
                                                                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">ID: {item.id?.slice(0, 4)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[var(--background)] border border-[var(--border)] text-[var(--color-text-main)] capitalize">
                                                        {item.platform}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-[var(--color-text-muted)] italic max-w-xs truncate" title={item.reason}>
                                                        "{item.reason}"
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <div className="w-20 h-1.5 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border)]">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${item.trust_score}%` }}
                                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                                className={`h-full rounded-full ${item.trust_score < 40 ? 'bg-rose-500' : 'bg-amber-500'}`}
                                                            />
                                                        </div>
                                                        <span className={`text-[10px] font-bold ${item.trust_score < 40 ? 'text-rose-600' : 'text-amber-600'}`}>
                                                            {item.trust_score}% Score
                                                        </span>
                                                    </div>
                                                </td>
                                                {role === 'admin' && (
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleToggleLanding(item.id, item.show_on_landing_page)}
                                                            className={`p-1.5 rounded-lg transition-all ${item.show_on_landing_page
                                                                    ? 'bg-[var(--primary)] text-white shadow-sm'
                                                                    : 'text-[var(--color-text-muted)] hover:bg-[var(--background)]'
                                                                }`}
                                                            title="Toggle Display on Landing Page"
                                                        >
                                                            <Globe className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-right">
                                                    {role === 'admin' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleUpdateStatus(item.id, 'verified')}
                                                                disabled={item.status === 'verified'}
                                                                className="p-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-100 disabled:opacity-30 disabled:hover:bg-emerald-50 transition-colors"
                                                                title="Verifikasi"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                                                disabled={item.status === 'rejected'}
                                                                className="p-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg hover:bg-rose-100 disabled:opacity-30 disabled:hover:bg-rose-50 transition-colors"
                                                                title="Tolak"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-[var(--color-text-muted)] italic">View Only</span>
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
            </div>
        </ProtectedRoute>
    );
}
