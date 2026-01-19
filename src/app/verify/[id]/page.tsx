'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Video, AlertCircle, CheckCircle2, Package, Info, Play, Lock, ChevronRight, MessageCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BuyerVerifyPage({ params }: { params: { id: string } }) {
    const [isRecordingStarted, setIsRecordingStarted] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [viewSellerVideo, setViewSellerVideo] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [sellerEvidence, setSellerEvidence] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch order by tracking number
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('tracking_number', params.id)
                    .single();

                if (orderError) throw orderError;
                setOrder(orderData);

                // 2. Fetch seller's packing evidence
                const { data: evidenceData, error: evidenceError } = await supabase
                    .from('evidences')
                    .select('*')
                    .eq('order_id', orderData.id)
                    .eq('type', 'packing')
                    .single();

                if (!evidenceError) {
                    setSellerEvidence(evidenceData);
                }
            } catch (err: any) {
                console.error('Error fetching data:', err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleFinishUnboxing = async () => {
        if (!order) return;

        setIsUploading(true);
        try {
            // Mocking unboxing upload
            const { error: evidenceError } = await supabase
                .from('evidences')
                .insert([{
                    order_id: order.id,
                    type: 'unboxing',
                    media_url: 'https://vimeo.com/placeholder-unboxing-video',
                    metadata: {
                        device: 'Android Phone',
                        location: 'Customer Location',
                        sensor_status: 'Locked'
                    }
                }]);

            if (evidenceError) throw evidenceError;

            // Update order status if needed
            await supabase
                .from('orders')
                .update({ status: 'delivered' })
                .eq('id', order.id);

            setIsDone(true);
        } catch (err: any) {
            console.error('Evidence link failed:', err.message);
            alert('Gagal mengunci bukti: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-xs font-bold text-dark/40 uppercase tracking-[0.2em]">Verifikasi Link Aman...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-rose-500" />
                </div>
                <h1 className="text-2xl font-black text-dark tracking-tight">Order Tidak Ditemukan</h1>
                <p className="text-dark/60 mt-2 mb-8">Maaf, nomor resi <span className="text-primary font-bold">#{params.id}</span> belum terdaftar di sistem EcomGuard.</p>
                <Link href="/" className="px-8 py-4 bg-dark text-white rounded-2xl font-bold">Kembali ke Beranda</Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-black text-dark mb-2 tracking-tight">Verified Unboxing</h1>
                <p className="text-dark/60">Order ID: <span className="font-mono font-bold text-primary">#{params.id}</span></p>
            </motion.div>

            {!isDone ? (
                <div className="space-y-6">
                    {/* Transparency Section: Seller's Video */}
                    {sellerEvidence && (
                        <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        <Package className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark text-sm tracking-tight">Melihat Bukti Packing Seller</h4>
                                        <p className="text-[10px] text-dark/40 font-mono">Diproteksi oleh EcomGuard Vault</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewSellerVideo(!viewSellerVideo)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-xs font-bold text-primary hover:bg-emerald-50 transition-all border border-primary/10"
                                >
                                    <Play className="w-3 h-3 fill-current" /> {viewSellerVideo ? 'Tutup' : 'Lihat'}
                                </button>
                            </div>

                            <AnimatePresence>
                                {viewSellerVideo && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-4"
                                    >
                                        <div className="aspect-video bg-dark/10 rounded-2xl flex items-center justify-center relative group cursor-pointer">
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent pointer-events-none" />
                                            <div className="absolute bottom-3 left-3 flex gap-2">
                                                <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest">Original Feed</span>
                                                <span className="text-[8px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest">Metadata Locked</span>
                                            </div>
                                            <Play className="w-10 h-10 text-white drop-shadow-lg opacity-80 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <p className="text-[10px] text-dark/40 mt-3 text-center italic">Bukti packing dikunci pada {new Date(sellerEvidence.created_at).toLocaleString('id-ID')}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    <div className="glass-card p-8">
                        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2 tracking-tight">
                            <Lock className="w-5 h-5 text-primary" /> Secure Unboxing Mode
                        </h2>
                        <ul className="space-y-4 text-dark/70 text-sm">
                            <li className="flex gap-3">
                                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                                <p>Rekam label resi dengan jelas di awal video.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                                <p>Tunjukkan paket masih tersegel dari 6 sisi.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                                <p>Buka dan tunjukkan isi barang tanpa skip video.</p>
                            </li>
                        </ul>

                        <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 italic text-xs text-rose-700">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>Video ini direkam dengan metadata-locking (Sensor & GPS Tag) untuk menjamin keaslian bukti jika terjadi sengketa.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsRecordingStarted(true)}
                        className={`w-full py-5 rounded-[2.5rem] font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl ${isRecordingStarted
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95'
                            }`}
                    >
                        {isRecordingStarted ? (
                            <><span className="w-3 h-3 bg-white rounded-full animate-ping" /> Sedang Merekam...</>
                        ) : (
                            <><Video className="w-6 h-6" /> Mulai Secure Unboxing</>
                        )}
                    </button>

                    {isRecordingStarted && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleFinishUnboxing}
                            disabled={isUploading}
                            className="w-full py-5 bg-dark text-white rounded-[2.5rem] font-bold shadow-xl flex items-center justify-center gap-2"
                        >
                            {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Mengunci Bukti...</> : <>Selesai & Kunci Bukti <ChevronRight className="w-5 h-5" /></>}
                        </motion.button>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-600 w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-black text-dark mb-4 tracking-tight">Bukti Terkunci Aman!</h2>
                    <p className="text-dark/60 mb-8 leading-relaxed">Video unboxing Anda telah berhasil di-upload dengan tanda digital. Anda aman dari tuduhan manipulasi.</p>

                    <div className="space-y-4">
                        <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2">
                            <MessageCircle className="w-5 h-5" /> Ajukan Easy Claim (Pusat Resolusi)
                        </button>
                        <Link href="/" className="inline-block text-sm font-bold text-dark/40 hover:text-dark transition-all underline underline-offset-4">
                            Kembali ke Beranda
                        </Link>
                    </div>
                </motion.div>
            )}

            <div className="mt-12 text-center">
                <p className="text-[10px] text-dark/30 uppercase font-bold tracking-[0.2em]">Verified Secure by EcomGuard Network</p>
            </div>
        </div>
    );
}
