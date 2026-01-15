'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Gavel,
    Upload,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    Package,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewDisputePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        order_id: '',
        resi: '',
        reason: '',
        description: '',
        priority: 'Medium'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.email) {
            alert('Sesi Anda tidak valid. Silakan login kembali.');
            return;
        }

        setIsLoading(true);
        console.log('Sending dispute data...', {
            buyer_id: user.id,
            buyer_email: user.email,
            ...formData
        });

        try {
            // First, try a simple insert without select to see if it works
            const { error: insertError } = await supabase.from('disputes').insert([
                {
                    buyer_id: user.id || null,
                    buyer_email: user.email,
                    order_id: formData.order_id || null,
                    resi: formData.resi,
                    reason: formData.reason,
                    description: formData.description,
                    priority: formData.priority,
                    status: 'pending'
                }
            ]);

            if (insertError) {
                console.error('Supabase Insert Error:', insertError);
                throw insertError;
            }

            console.log('Insert successful!');
            setIsSubmitted(true);

            // Re-enable RLS for security after test
            setTimeout(async () => {
                router.push('/buyer');
            }, 3000);
        } catch (err: any) {
            console.error('Final Catch Error:', err);
            alert('Gagal mengirim: ' + (err.message || 'Terjadi kesalahan sistem'));
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
                    className="glass-card p-12 text-center max-w-md space-y-6"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-dark">Sengketa Terkirim!</h2>
                    <p className="text-dark/60 font-medium leading-relaxed">
                        Laporan Anda telah resmi masuk ke sistem. Admin dan Seller akan meninjau bukti Anda dalam waktu 1x24 jam.
                    </p>
                    <Link
                        href="/buyer"
                        className="block w-full py-4 bg-dark text-white font-bold rounded-2xl hover:scale-105 transition-all"
                    >
                        Kembali ke Dashboard
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['buyer']}>
            <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <Link href="/buyer" className="flex items-center gap-2 text-dark/40 hover:text-dark font-bold transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </Link>

                    <div>
                        <h1 className="text-3xl font-black text-dark flex items-center gap-3">
                            <Gavel className="text-primary w-8 h-8" />
                            Ajukan <span className="text-primary">Sengketa</span>
                        </h1>
                        <p className="text-dark/50 font-medium">Beri tahu kami apa yang salah dengan pesanan Anda.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="glass-card p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">ID Pesanan (Optional)</label>
                                    <div className="relative">
                                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                                        <input
                                            type="text"
                                            placeholder="Contoh: SG-90210"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-dark/[0.02] border border-dark/10 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                                            value={formData.order_id}
                                            onChange={e => setFormData({ ...formData, order_id: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Nomor Resi / Waybill</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Masukkan nomor resi..."
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-dark/[0.02] border border-dark/10 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                                            value={formData.resi}
                                            onChange={e => setFormData({ ...formData, resi: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Alasan Utama</label>
                                <select
                                    className="w-full px-4 py-4 rounded-2xl bg-dark/[0.02] border border-dark/10 focus:ring-2 focus:ring-primary focus:outline-none font-bold appearance-none"
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    required
                                >
                                    <option value="">Pilih Alasan...</option>
                                    <option value="Barang Rusak">Barang Rusak / Pecah</option>
                                    <option value="Barang Tidak Sesuai">Barang Tidak Sesuai (Salah Produk)</option>
                                    <option value="Paket Kosong">Paket Kosong / Kurang</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Penjelasan Detail</label>
                                <textarea
                                    rows={4}
                                    placeholder="Ceritakan kronologi kejadian secara mendetail..."
                                    className="w-full px-4 py-4 rounded-2xl bg-dark/[0.02] border border-dark/10 focus:ring-2 focus:ring-primary focus:outline-none font-medium resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                    Pastikan Anda sudah merekam video unboxing. Admin akan meminta tautan video tersebut jika bukti foto tidak mencukupi untuk memenangkan sengketa.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Mengirim...' : 'Kirim Sengketa Resmi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
