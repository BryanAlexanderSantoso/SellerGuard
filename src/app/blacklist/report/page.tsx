'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldAlert,
    ArrowLeft,
    User,
    Globe,
    AlertTriangle,
    FileText,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReportBlacklistPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        subject_name: '',
        platform: 'Shopee',
        reason: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('Silakan login terlebih dahulu.');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Validate Role First
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'seller') {
                throw new Error('Akses Ditolak: Hanya akun Seller yang boleh melapor.');
            }

            const basePayload = {
                reported_by: user.id,
                subject_name: formData.subject_name,
                platform: formData.platform,
                reason: formData.reason,
                status: 'pending',
            };

            // 2. Attempt Insert (Try with description first)
            let { error } = await supabase.from('blacklist').insert([{
                ...basePayload,
                description: formData.description
            }]);

            // 3. Fallback: If description column missing (migration schema mismatch), retry without it
            if (error && error.message?.toLowerCase().includes('column "description" of relation "blacklist" does not exist')) {
                console.warn('Database schema outdated (missing description column). Retrying without description...');
                const retry = await supabase.from('blacklist').insert([basePayload]);
                error = retry.error;
            }

            if (error) throw error;

            console.log('Report submitted successfully!');
            setIsSubmitted(true);
            setTimeout(() => {
                router.push('/seller');
            }, 3000);
        } catch (err: any) {
            console.error('Submit Error:', err);
            alert('Gagal mengirim laporan: ' + (err.message || 'Terjadi kesalahan sistem'));
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center max-w-md space-y-6 bg-white dark:bg-black/40"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Laporan Terkirim!</h2>
                    <p className="text-slate-600 dark:text-white/60 font-medium leading-relaxed">
                        Terima kasih telah berkontribusi menjaga ekosistem. Tim Admin akan memverifikasi laporan Anda dalam 24 jam.
                    </p>
                    <Link
                        href="/seller"
                        className="block w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-105 transition-all text-sm"
                    >
                        Kembali ke Dashboard
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['seller']}>
            <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    <Link href="/seller" className="flex items-center gap-2 text-dark/40 hover:text-dark font-bold transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
                    </Link>

                    <div>
                        <h1 className="text-3xl font-black text-dark flex items-center gap-3">
                            <ShieldAlert className="text-rose-500 w-8 h-8" />
                            Laporkan <span className="text-rose-500">Akun Penipu</span>
                        </h1>
                        <p className="text-dark/50 font-medium">Bantu seller lain menghindari kerugian dengan melaporkan pengalaman buruk Anda.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="glass-card p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Nama / Username Penipu</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: budi_scammer88"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-dark/[0.02] border border-dark/10 focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                                        value={formData.subject_name}
                                        onChange={e => setFormData({ ...formData, subject_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Platform Kejadian</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                                        <select
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-dark/[0.02] border border-dark/10 focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold appearance-none"
                                            value={formData.platform}
                                            onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                        >
                                            <option value="Shopee">Shopee</option>
                                            <option value="Tokopedia">Tokopedia</option>
                                            <option value="TikTok Shop">TikTok Shop</option>
                                            <option value="Lazada">Lazada</option>
                                            <option value="WhatsApp / Manual">WhatsApp / Manual</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Kategori Fraud</label>
                                    <select
                                        className="w-full px-4 py-4 rounded-2xl bg-dark/[0.02] border border-dark/10 focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold appearance-none"
                                        value={formData.reason}
                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                        required
                                    >
                                        <option value="">Pilih Modus...</option>
                                        <option value="Retur Barang Palsu">Retur Barang Palsu/Tukar</option>
                                        <option value="Retur Paket Kosong">Retur Paket Kosong</option>
                                        <option value="Manipulasi Bukti">Manipulasi Bukti Video</option>
                                        <option value="Hit & Run">Hit & Run (COD Gagal)</option>
                                        <option value="Ancaman / Intimidasi">Ancaman / Intimidasi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Kronologi Kejadian</label>
                                <textarea
                                    rows={4}
                                    placeholder="Ceritakan bagaimana Anda ditipu oleh akun ini..."
                                    className="w-full px-4 py-4 rounded-2xl bg-dark/[0.02] border border-dark/10 focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                                <p className="text-xs text-rose-700 font-medium leading-relaxed">
                                    Laporan palsu dapat menyebabkan akun Seller Anda ditandai atau diblokir. Pastikan Anda memiliki bukti chat atau foto paket yang mendukung.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-rose-500 text-white font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-rose-500/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Mengirim...</> : 'Kirim Laporan Komunitas'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
