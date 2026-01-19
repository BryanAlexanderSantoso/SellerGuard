'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, MessageSquare, ShieldCheck, FileText, ChevronRight, Loader2, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DisputeCenter() {
    const { role } = useAuth();
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
            <div className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl font-serif font-medium text-[var(--color-text-main)]">Dispute Center</h1>
                        <p className="text-[var(--color-text-muted)] mt-2">Kelola sengketa dan mediasi dengan bukti transaksi yang valid</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content: Dispute List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider flex items-center gap-2">
                                    <Gavel className="w-4 h-4" /> Active Disputes
                                </h2>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center py-20 gap-4">
                                    <Loader2 className="w-8 h-8 text-[var(--color-text-muted)] animate-spin" />
                                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Memuat Data...</p>
                                </div>
                            ) : disputes.length === 0 ? (
                                <div className="p-12 border border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center text-center opacity-60">
                                    <ShieldCheck className="w-12 h-12 text-[var(--color-text-muted)] mb-4" />
                                    <p className="font-medium text-[var(--color-text-muted)] text-sm">Tidak ada sengketa aktif saat ini.</p>
                                </div>
                            ) : (
                                disputes.map((dispute, index) => (
                                    <motion.div
                                        key={dispute.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="claude-card p-6 group hover:border-[var(--primary)] transition-colors"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 w-10 h-10 rounded-lg flex items-center justify-center border ${dispute.priority === 'High'
                                                        ? 'bg-red-50 border-red-100 text-red-600'
                                                        : 'bg-[var(--background)] border-[var(--border)] text-[var(--color-text-muted)]'
                                                    }`}>
                                                    <MessageSquare className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-mono text-xs text-[var(--color-text-muted)]">#{dispute.id.slice(0, 8)}</span>
                                                        {dispute.priority === 'High' && (
                                                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                High Priority
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-serif text-lg text-[var(--color-text-main)] mb-1">
                                                        Sengketa Order <span className="font-mono text-sm text-[var(--color-text-muted)] ml-1">{dispute.resi}</span>
                                                    </h3>
                                                    <p className="text-sm text-[var(--color-text-muted)]">
                                                        Pembeli: <span className="font-medium text-[var(--color-text-main)]">{dispute.buyer_email?.split('@')[0]}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:items-end gap-3">
                                                <div className="flex items-center gap-2">
                                                    {dispute.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                                                    {dispute.status === 'resolved' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                                    {dispute.status === 'rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${dispute.status === 'pending' ? 'text-amber-600' :
                                                            dispute.status === 'resolved' ? 'text-emerald-600' :
                                                                'text-red-600'
                                                        }`}>{dispute.status}</span>
                                                </div>

                                                {dispute.status === 'pending' && (
                                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                                        <button
                                                            onClick={() => handleUpdateStatus(dispute.id, 'resolved')}
                                                            className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(dispute.id, 'rejected')}
                                                            className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Sidebar: Stats */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Statistics
                            </h2>
                            <div className="claude-card p-6 space-y-8 sticky top-32">
                                <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Success Rate</p>
                                        <h4 className="text-4xl font-serif font-medium text-[var(--color-text-main)]">
                                            {stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(0) : '0'}%
                                        </h4>
                                    </div>
                                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[var(--color-text-muted)]">Total Cases</span>
                                        <span className="font-mono font-medium text-[var(--color-text-main)]">{stats.total}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[var(--color-text-muted)]">Resolved</span>
                                        <span className="font-mono font-medium text-emerald-600">{stats.won}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[var(--color-text-muted)]">Pending Review</span>
                                        <span className="font-mono font-medium text-amber-600">{stats.pending}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[var(--color-text-muted)]">Rejected</span>
                                        <span className="font-mono font-medium text-red-600">{stats.lost}</span>
                                    </div>
                                </div>

                                <button className="claude-button w-full flex items-center justify-center gap-2 text-xs">
                                    <FileText className="w-4 h-4" /> Download Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
