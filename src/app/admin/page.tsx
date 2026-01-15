'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, Check, X, ShieldAlert, Filter, Search, Play, Users, TrendingUp, BarChart3, Eye, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState({
        totalResolved: 0,
        pending: 0,
        blacklisted: 0,
        fraudBlocked: 0
    });

    useEffect(() => {
        setMounted(true);
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch PENDING Blacklist Reports (Moderation Queue)
                const { data: reportData, error: reportError } = await supabase
                    .from('blacklist')
                    .select('*')
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false });

                if (!reportError) setReports(reportData || []);

                // 2. Fetch Stats from database
                const { count: blacklistedCount } = await supabase
                    .from('blacklist')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'verified');

                const { count: pendingCount } = await supabase
                    .from('blacklist')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending');

                // Fetch global stats
                const { data: statsData } = await supabase
                    .from('stats')
                    .select('key, value')
                    .in('key', ['total_resolved_disputes', 'total_fraud_blocked']);

                const totalResolved = statsData?.find(s => s.key === 'total_resolved_disputes')?.value || 0;
                const fraudBlocked = statsData?.find(s => s.key === 'total_fraud_blocked')?.value || 0;

                setStats({
                    totalResolved: Number(totalResolved),
                    pending: pendingCount || 0,
                    blacklisted: blacklistedCount || 0,
                    fraudBlocked: Number(fraudBlocked)
                });

            } catch (err) {
                console.error('Admin fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Real-time subscription
        const channel = supabase
            .channel('admin_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'blacklist' }, () => fetchData())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleVerdict = async (id: string, newStatus: 'verified' | 'dismissed') => {
        try {
            const { error } = await supabase
                .from('blacklist')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            setSelectedReport(null);
        } catch (err: any) {
            alert('Gagal update status: ' + err.message);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background data-theme-aware transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-dark dark:text-white tracking-tight">Ecosystem <span className="text-primary">Oversight</span></h1>
                        <p className="text-dark/60 dark:text-white/60 mt-1">Global command center for fraud detection & mediation</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search reports or accounts..."
                                className="bg-white dark:bg-white/5 border border-dark/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none w-80 text-dark dark:text-white transition-all shadow-sm"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/30" />
                        </div>
                        <button className="p-3 bg-white dark:bg-white/5 border border-dark/10 dark:border-white/10 rounded-xl hover:bg-dark/[0.02] transition-colors">
                            <Filter className="w-5 h-5 text-dark/70 dark:text-white/70" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Resolved', value: stats.totalResolved.toLocaleString(), icon: ShieldCheck, color: 'emerald' },
                        { label: 'Pending Review', value: stats.pending, icon: AlertCircle, color: 'amber' },
                        { label: 'Verified Blacklist', value: stats.blacklisted, icon: ShieldAlert, color: 'rose' },
                        { label: 'Fraud Attempts Blocked', value: stats.fraudBlocked.toLocaleString(), icon: TrendingUp, color: 'blue' }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 flex items-center gap-5 dark:bg-white/5"
                        >
                            <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-dark/40 dark:text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-dark dark:text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Live Incidents Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-black text-dark dark:text-white flex items-center gap-2">
                                <Play className="w-5 h-5 text-primary fill-primary" /> Moderation Queue (Pending)
                            </h2>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full animate-pulse uppercase tracking-widest">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full" /> Live
                            </span>
                        </div>

                        <div className="bg-white dark:bg-white/5 border border-dark/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-dark/[0.02] dark:bg-white/[0.02] border-bottom border-dark/5 dark:border-white/5">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-dark/40 dark:text-white/40">Timestamp</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-dark/40 dark:text-white/40">Subject</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-dark/40 dark:text-white/40">Reason</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-dark/40 dark:text-white/40 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!mounted || isLoading) ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                                                <p className="text-xs font-bold text-dark/30 dark:text-white/30 tracking-widest uppercase">Fetching Live Data...</p>
                                            </td>
                                        </tr>
                                    ) : reports.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-dark/30 dark:text-white/30 font-bold uppercase tracking-widest text-xs">
                                                No pending reports found in ecosystem
                                            </td>
                                        </tr>
                                    ) : (
                                        reports.map((report) => (
                                            <tr key={report.id} className="border-b border-dark/5 dark:border-white/5 hover:bg-dark/[0.01] dark:hover:bg-white/[0.01] transition-colors group">
                                                <td className="px-6 py-4 text-xs font-mono text-dark/50 dark:text-white/50">
                                                    {new Date(report.created_at).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-dark dark:text-white">{report.subject_name}</span>
                                                        <span className="text-[10px] text-dark/40 dark:text-white/40 font-bold uppercase tracking-widest">{report.platform}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-500/20">
                                                        {report.reason}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedReport(report)}
                                                        className="p-2.5 bg-dark/5 dark:bg-white/5 hover:bg-primary hover:text-white rounded-xl transition-all group-hover:scale-110 active:scale-90"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mediation Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-dark text-white rounded-[2.5rem] p-8 min-h-[500px] relative overflow-hidden flex flex-col shadow-2xl dark:bg-[#111827]">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <ShieldAlert className="w-32 h-32" />
                            </div>

                            <div className="relative z-10 flex-1">
                                {selectedReport ? (
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Detailed Mediation Analysis</p>
                                            <h3 className="text-2xl font-black tracking-tight">{selectedReport.subject_name}</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Evidence Review</p>
                                                <div className="flex gap-2">
                                                    <div className="flex-1 aspect-video bg-white/10 rounded-xl flex items-center justify-center border border-dashed border-white/20">
                                                        <Play className="w-4 h-4 opacity-40 hover:scale-125 transition-transform cursor-pointer" />
                                                    </div>
                                                    <div className="flex-1 aspect-video bg-white/10 rounded-xl flex items-center justify-center border border-dashed border-white/20">
                                                        <Play className="w-4 h-4 opacity-40 hover:scale-125 transition-transform cursor-pointer" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white/10 rounded-2xl p-4">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Report Context</p>
                                                <p className="text-sm font-medium leading-relaxed italic">
                                                    "{selectedReport.description || 'No description provided.'}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/10 mt-auto">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 text-center">Protocol Verdict Selection</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => handleVerdict(selectedReport.id, 'verified')}
                                                    className="bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                                                >
                                                    <Check className="w-4 h-4" /> ACC (Proses)
                                                </button>
                                                <button
                                                    onClick={() => handleVerdict(selectedReport.id, 'dismissed')}
                                                    className="bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <X className="w-4 h-4" /> Tolak (Non ACC)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <ShieldCheck className="w-16 h-16 text-primary mb-6" />
                                        <h3 className="text-xl font-black tracking-tight mb-2">Ready for Mediation</h3>
                                        <p className="text-white/40 text-sm font-medium max-w-[200px]">Select an incident from the feed to perform protocol analysis</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Audit Log Card */}
                        <div className="mt-6 glass-card p-6 dark:bg-white/5 border-dashed border-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40 dark:text-white/40 mb-4 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" /> Ecosystem Scan Log
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    <span>MD5 Hash match found on 2 incidents</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-dark/30 dark:text-white/30 uppercase tracking-[0.1em]">
                                    <div className="w-1.5 h-1.5 bg-dark/20 dark:bg-white/20 rounded-full" />
                                    <span>Scanning Global Blacklist DB... 100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Modal Placeholder */}
                <AnimatePresence>
                    {selectedReport && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            {/* Backdrop check handled by state or separate overlay */}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </ProtectedRoute>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );
}
