'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Gavel,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowLeft,
    Search,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function BuyerDisputesPage() {
    const { user } = useAuth();
    const [disputes, setDisputes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyDisputes = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('disputes')
                    .select('*')
                    .eq('buyer_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setDisputes(data || []);
            } catch (err) {
                console.error('Error fetching my disputes:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyDisputes();
    }, [user]);

    return (
        <ProtectedRoute allowedRoles={['buyer']}>
            <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <Link href="/buyer" className="flex items-center gap-2 text-dark/40 hover:text-dark font-bold transition-colors mb-2">
                                <ArrowLeft className="w-4 h-4" /> Dashboard
                            </Link>
                            <h1 className="text-3xl font-black text-dark flex items-center gap-3">
                                <Gavel className="text-primary w-8 h-8" />
                                Riwayat <span className="text-primary">Sengketa</span>
                            </h1>
                            <p className="text-dark/50 font-medium">Pantau status laporan kendala paket Anda.</p>
                        </div>
                        <Link
                            href="/buyer/dispute/new"
                            className="px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                        >
                            Ajukan Sengketa Baru
                        </Link>
                    </div>

                    <div className="glass-card overflow-hidden">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center gap-4">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                <p className="text-sm font-bold text-dark/40 uppercase tracking-widest px-1">Memuat Data...</p>
                            </div>
                        ) : disputes.length === 0 ? (
                            <div className="py-20 flex flex-col items-center text-center space-y-4">
                                <AlertCircle className="w-16 h-16 text-dark/10" />
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-dark">Belum Ada Sengketa</h3>
                                    <p className="text-dark/40 font-medium">Anda belum pernah mengajukan sengketa paket.</p>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-dark/[0.02] text-xs font-bold text-dark/40 uppercase tracking-widest">
                                        <th className="px-8 py-5">Info Paket</th>
                                        <th className="px-8 py-5">Alasan</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark/5">
                                    {disputes.map((dispute, i) => (
                                        <motion.tr
                                            key={dispute.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-dark/[0.01] transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div>
                                                    <p className="font-bold text-dark">{dispute.resi}</p>
                                                    <p className="text-xs text-dark/40 font-mono">{dispute.order_id || 'Tanpa ID Order'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-dark">{dispute.reason}</p>
                                                <p className="text-xs text-dark/50 truncate max-w-xs">{dispute.description}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${dispute.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                        dispute.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' :
                                                            dispute.status === 'rejected' ? 'bg-rose-100 text-rose-600' :
                                                                'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {dispute.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-bold text-dark/40 uppercase">
                                                    {new Date(dispute.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
