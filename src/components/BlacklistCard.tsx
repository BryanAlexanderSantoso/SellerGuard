'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ExternalLink, ThumbsDown, UserX, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface BlacklistEntry {
    id: string;
    subject_name: string;
    platform: string;
    reason: string;
    trust_score: number;
    created_at: string;
}

const BlacklistCard = () => {
    const [entries, setEntries] = useState<BlacklistEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlacklist = async () => {
            const { data, error } = await supabase
                .from('blacklist')
                .select('*')
                .eq('status', 'verified')
                .order('created_at', { ascending: false })
                .limit(3);

            if (!error && data) {
                setEntries(data);
            }
            setIsLoading(false);
        };

        fetchBlacklist();

        // Optional: Real-time subscription
        const channel = supabase
            .channel('public:blacklist')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blacklist' }, () => {
                fetchBlacklist();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Baru saja';
        if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
        return `${Math.floor(diffInHours / 24)} hari yang lalu`;
    };

    return (
        <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Database Penipu</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Laporan terbaru dari komunitas SellerGuard</p>
                </div>
                <Link href="/blacklist" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                    Lihat Semua <ExternalLink className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-xs font-bold text-dark/40 uppercase tracking-widest">Memuat database...</p>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-dark/5 rounded-[2rem] bg-dark/[0.01]">
                        <UserX className="w-12 h-12 text-dark/10 mx-auto mb-3" />
                        <p className="text-sm text-dark/40 font-bold uppercase tracking-widest">Belum ada laporan terverifikasi</p>
                    </div>
                ) : (
                    entries.map((account, index) => (
                        <motion.div
                            key={account.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-white/80 dark:bg-white/5 border border-dark/5 dark:border-white/5 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                                    <UserX className="text-rose-600 w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-dark">{account.subject_name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] bg-dark/5 px-2 py-0.5 rounded-full text-dark/60 font-bold uppercase tracking-wider">{account.platform}</span>
                                        <span className="text-xs text-rose-500 font-medium">{account.reason}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-dark/40 uppercase font-bold tracking-widest mb-1">Trust Score</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-dark/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${account.trust_score}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={`h-full ${account.trust_score < 40 ? 'bg-rose-500' : 'bg-amber-500'
                                                    }`}
                                            />
                                        </div>
                                        <span className={`text-xs font-bold ${account.trust_score < 40 ? 'text-rose-600' : 'text-amber-600'
                                            }`}>
                                            {account.trust_score}%
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-dark/40 mt-1">{formatDate(account.created_at)}</p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <Link href="/blacklist/report" className="w-full mt-6 py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 group">
                <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Laporkan Akun Mencurigakan
            </Link>
        </div>
    );
};

export default BlacklistCard;
