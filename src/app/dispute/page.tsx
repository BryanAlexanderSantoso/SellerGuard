'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, MessageSquare, ShieldCheck, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DisputeCenter() {
    const { role, user } = useAuth();
    const [disputes, setDisputes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        won: 0,
        pending: 0,
        lost: 0
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let query = supabase.from('disputes').select('*').order('created_at', { ascending: false });

            // If seller, maybe only show their disputes? 
            // For now, let's show all for admin/seller as they are part of the mediation team
            // or if seller, show disputes related to them (if we have seller_id)

            const { data, error } = await query;
            if (error) throw error;
            setDisputes(data || []);

            // Calculate stats
            const total = data?.length || 0;
            const won = data?.filter(d => d.status === 'resolved').length || 0;
            const pending = data?.filter(d => d.status === 'pending' || d.status === 'in_review').length || 0;
            const lost = data?.filter(d => d.status === 'rejected').length || 0;

            setStats({ total, won, pending, lost });
        } catch (err) {
            console.error('Error fetching disputes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('disputes')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert('Gagal update status: ' + err.message);
        }
    };

    useEffect(() => {
        if (role) fetchData();
    }, [role]);

    return (
        <ProtectedRoute allowedRoles={['admin', 'seller']}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-colors duration-300 min-h-screen pt-20">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-dark dark:text-white tracking-tight">Pusat <span className="text-primary">Sengketa</span></h1>
                    <p className="text-dark/60 dark:text-white/60 mt-1">Kelola dan selesaikan komplain pembeli dengan bukti yang kuat</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-dark dark:text-white flex items-center gap-2">
                            <Gavel className="w-6 h-6 text-primary" /> Sengketa Aktif
                        </h2>

                        {isLoading ? (
                            <div className="flex flex-col items-center py-20 gap-4">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                <p className="text-sm font-bold text-dark/40 uppercase tracking-widest">Memuat Sengketa...</p>
                            </div>
                        ) : disputes.length === 0 ? (
                            <div className="p-12 border-2 border-dashed border-dark/5 dark:border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center opacity-40">
                                <ShieldCheck className="w-16 h-16 text-dark/20 dark:text-white/20 mb-4" />
                                <p className="font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest">Tidak ada sengketa terbaru</p>
                            </div>
                        ) : (
                            disputes.map((dispute, index) => (
                                <motion.div
                                    key={dispute.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-primary/30"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dispute.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-primary/10 text-primary'
                                            }`}>
                                            <MessageSquare className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-dark dark:text-white">#{dispute.id.slice(0, 8)}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${dispute.priority === 'High' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-dark/5 dark:bg-white/10 text-dark/60 dark:text-white/60'
                                                    }`}>
                                                    {dispute.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-dark/50 dark:text-white/50 font-medium">
                                                Pembeli: <span className="text-dark dark:text-white">{dispute.buyer_email?.split('@')[0]}</span> •
                                                Resi: <span className="font-mono text-primary ml-1">{dispute.resi}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
                                        <div className="text-left sm:text-right">
                                            <p className="text-[10px] font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-0.5">Status</p>
                                            <span className={`text-xs font-black uppercase ${dispute.status === 'pending' ? 'text-amber-500' :
                                                dispute.status === 'resolved' ? 'text-emerald-500' :
                                                    'text-primary'
                                                }`}>{dispute.status}</span>
                                        </div>

                                        {dispute.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(dispute.id, 'resolved')}
                                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                                                >
                                                    Selesaikan
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(dispute.id, 'rejected')}
                                                    className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-rose-500/20"
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-dark dark:text-white flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-primary" /> Statistik Sengketa
                        </h2>
                        <div className="glass-card p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-1">Global Win Rate</p>
                                    <h4 className="text-3xl font-extrabold text-primary">
                                        {stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : '0'}%
                                    </h4>
                                </div>
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-dark/60 dark:text-white/60 font-medium">Total Sengketa</span>
                                    <span className="text-dark dark:text-white font-bold font-mono">{stats.total}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-dark/60 dark:text-white/60 font-medium">Berhasil Diselesaikan</span>
                                    <span className="text-emerald-600 font-bold font-mono">{stats.won}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-dark/60 dark:text-white/60 font-medium">Sedang Berjalan</span>
                                    <span className="text-amber-600 font-bold font-mono">{stats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-dark/60 dark:text-white/60 font-medium">Ditolak/Gagal</span>
                                    <span className="text-rose-600 font-bold font-mono">{stats.lost}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-dark dark:bg-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-dark/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <FileText className="w-5 h-5" /> Download Laporan Sengketa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
