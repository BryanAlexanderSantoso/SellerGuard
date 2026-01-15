'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, PlayCircle, Upload, CheckCircle2, Package, Search, Camera, ShieldCheck, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const RecordAction = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [resi, setResi] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isGeneratingLegal, setIsGeneratingLegal] = useState(false);

    const handleUpload = async () => {
        if (!resi || !user) {
            alert('Mohon login terlebih dahulu atau isi nomor resi.');
            return;
        }

        setIsUploading(true);
        try {
            // 1. Create the order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    seller_id: user.id,
                    tracking_number: resi,
                    status: 'shipped'
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create the packing evidence (mocking the media_url for now)
            const { error: evidenceError } = await supabase
                .from('evidences')
                .insert([{
                    order_id: order.id,
                    uploader_id: user.id,
                    type: 'packing',
                    media_url: 'https://vimeo.com/placeholder-packing-video', // Mock URL
                    metadata: {
                        device: 'iPhone 15 Pro',
                        location: 'Depok, Indonesia',
                        fps: 60,
                        quality: '4K'
                    }
                }]);

            if (evidenceError) throw evidenceError;

            setStep(3);
        } catch (error: any) {
            console.error('Upload failed:', error.message);
            alert('Gagal mengupload bukti: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const generateLegalTemplate = () => {
        setIsGeneratingLegal(true);
        setTimeout(() => setIsGeneratingLegal(false), 2000);
    };

    return (
        <div className="glass-card p-8 h-full flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                        <Camera className="w-6 h-6 text-primary" /> Photo & Pack
                    </h2>
                    <p className="text-sm text-dark/60">Ambil foto resi & rekam video packing</p>
                </div>
                <div className="flex items-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${step === s ? 'w-6 bg-primary' : 'bg-primary/20'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-8">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Scan Barcode Resi..."
                                className="w-full bg-white/50 border border-dark/10 rounded-2xl py-5 px-14 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-lg font-medium"
                                value={resi}
                                onChange={(e) => setResi(e.target.value)}
                            />
                            <Scan className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-6 h-6" />
                            {resi && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold">VALID RESI</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-dark/60 leading-relaxed font-medium">
                                Metadata-Locked: SellerGuard akan langsung mengunci koordinat GPS, Timestamp, dan Device ID ke dalam bukti packing Anda.
                            </p>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={!resi}
                            className="w-full bg-primary text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                        >
                            <Camera className="w-6 h-6" /> Foto Resi (Step 1/2)
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="aspect-video bg-dark/5 rounded-[2.5rem] border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-primary/[0.03] transition-all relative overflow-hidden">
                            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                                <span className="w-2 h-2 bg-white rounded-full" /> REC LIVE
                            </div>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <PlayCircle className="text-primary w-8 h-8" />
                            </div>
                            <p className="text-dark/60 font-bold tracking-tight">Mulai Rekam Video Packing</p>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-dark/10 px-2 py-1 rounded">4K 60FPS</span>
                                <span className="text-[10px] bg-dark/10 px-2 py-1 rounded">GPS TAGGED</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="w-full bg-dark/5 text-dark font-bold py-4 rounded-2xl hover:bg-dark/10 transition-all"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Selesai & Upload'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center gap-6 py-4"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="text-emerald-600 w-12 h-12" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center">
                                <Upload className="w-5 h-5 text-primary" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-dark tracking-tight">Evidence Secured!</h3>
                            <p className="text-dark/60 mt-1">Order <span className="text-primary font-mono font-bold">#{resi}</span> telah terdaftar di SellerGuard Vault.</p>
                        </div>

                        <div className="w-full grid grid-cols-1 gap-3">
                            <button
                                onClick={generateLegalTemplate}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-dark text-white rounded-2xl font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                                disabled={isGeneratingLegal}
                            >
                                {isGeneratingLegal ? (
                                    <div className="flex items-center gap-2 italic"><span className="animate-spin text-lg">◌</span> Generating legal template...</div>
                                ) : (
                                    <><FileText className="w-4 h-4" /> Download Legal Template (Appeal)</>
                                )}
                            </button>
                            <button
                                onClick={() => { setStep(1); setResi(''); }}
                                className="w-full py-4 bg-white border border-dark/10 text-dark font-bold rounded-2xl hover:bg-dark/[0.02] transition-all text-sm"
                            >
                                Foto & Pack Paket Lain
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Float Label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-dark/5 rounded-full">
                <p className="text-[10px] font-bold text-dark/30 uppercase tracking-[0.2em]">Evidence Protection System v2.0</p>
            </div>
        </div>
    );
};

export default RecordAction;
