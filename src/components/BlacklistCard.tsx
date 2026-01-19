'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ExternalLink, UserX, Loader2 } from 'lucide-react';
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
        if (diffInHours < 24) return `${diffInHours} jam lalu`;
        return `${Math.floor(diffInHours / 24)} hari lalu`;
    };

    return (
        <div className="claude-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-serif font-medium text-[var(--color-text-main)]">Database Penipu</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">Laporan terbaru komunitas</p>
                </div>
                <Link href="/blacklist" className="text-[var(--primary)] text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">
                    Lihat Semua <ExternalLink className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-3 flex-1">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin opacity-50" />
                        <p className="text-xs text-[var(--color-text-muted)]">Memuat database...</p>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-xl bg-[var(--background)]">
                        <UserX className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-[var(--color-text-muted)]">Belum ada laporan terverifikasi</p>
                    </div>
                ) : (
                    entries.map((account, index) => (
                        <motion.div
                            key={account.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start justify-between p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl hover:shadow-sm transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                                    <UserX className="text-rose-600 w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-[var(--color-text-main)] text-sm">{account.subject_name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-[var(--color-text-muted)] bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded">{account.platform}</span>
                                        <span className="text-xs text-rose-600 truncate max-w-[120px]">{account.reason}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Trust Score</span>
                                    <span className={`text-sm font-medium ${account.trust_score < 40 ? 'text-rose-600' : 'text-amber-600'}`}>
                                        {account.trust_score}%
                                    </span>
                                </div>
                                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{formatDate(account.created_at)}</p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <Link href="/blacklist/report" className="w-full mt-6 py-3 bg-[var(--surface)] text-rose-600 font-medium text-sm rounded-lg border border-rose-100 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Laporkan Akun Mencurigakan
            </Link>
        </div>
    );
};

export default BlacklistCard;
