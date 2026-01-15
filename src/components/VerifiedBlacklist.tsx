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
                .order('created_at', { ascending: false }) // Tampilkan yang terbaru
                .limit(3);

            if (error) throw error;
            setList(data || []);
        } catch (err) {
            console.error('Error fetching landing blacklist:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlacklist();

        // Realtime Subscription
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
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                <p className="text-sm font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Memuat Daftar...</p>
            </div>
        );
    }

    if (list.length === 0) {
        return (
            <div className="col-span-full p-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-white/20 mb-4" />
                <p className="font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest text-sm">Belum ada penipu yang dipublish hari ini</p>
            </div>
        );
    }

    return (
        <>
            {list.map((item, i) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 border-rose-500/10 group hover:border-rose-500/30 transition-all flex flex-col h-full bg-white dark:bg-white/5"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <UserX className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{item.subject_name}</h4>
                            <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest">Terverifikasi Penipu</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1 uppercase tracking-tighter">Modus Operandi</p>
                            <p className="text-sm text-slate-600 dark:text-white/70 italic font-medium leading-relaxed">
                                "{item.reason}"
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest px-1">
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
