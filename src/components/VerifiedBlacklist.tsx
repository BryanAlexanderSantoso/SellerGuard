'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserX, ShieldAlert, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const VerifiedBlacklist = () => {
    const [list, setList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBlacklist = async () => {
        try {
            const { data, error } = await supabase
                .from('blacklist')
                .select('*')
                .eq('status', 'verified')
                .order('created_at', { ascending: false })
                .limit(3);

            if (error) throw error;
            setList(data || []);
        } catch (err: any) {
            console.error('Error fetching landing blacklist:', err);
            console.error('Error Details:', {
                message: err?.message,
                code: err?.code,
                details: err?.details,
                hint: err?.hint
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlacklist();

        const channel = supabase
            .channel('public_blacklist_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'blacklist' }, () => {
                fetchBlacklist();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="col-span-full flex flex-col items-center py-12 gap-4">
                <Loader2 className="w-6 h-6 text-[var(--color-text-muted)] animate-spin" />
                <p className="text-sm text-[var(--color-text-muted)] font-medium">Memuat Daftar...</p>
            </div>
        );
    }

    if (list.length === 0) {
        return (
            <div className="col-span-full p-12 border border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-10 h-10 text-[var(--color-text-muted)] opacity-50 mb-3" />
                <p className="text-[var(--color-text-muted)] font-medium text-sm">Belum ada data blacklist yang dipublish.</p>
            </div>
        );
    }

    return (
        <>
            {list.map((item, i) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="claude-card p-6 flex flex-col h-full bg-[var(--surface)] hover:border-[var(--primary)]"
                >
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-10 h-10 bg-[var(--background)] text-[var(--primary)] rounded-lg flex items-center justify-center border border-[var(--border)]">
                            <UserX className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-serif font-medium text-[var(--color-text-main)]">{item.subject_name}</h4>
                            <p className="text-xs font-medium text-[var(--primary)] uppercase tracking-wide">Terverifikasi Penipu</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Modus Operandi</p>
                            <p className="text-sm text-[var(--color-text-main)] italic leading-relaxed">
                                "{item.reason}"
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                            <span>Platform: {item.platform}</span>
                            <span>Reputasi: {item.trust_score}%</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </>
    );
};

export default VerifiedBlacklist;
