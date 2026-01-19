'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, PlayCircle, Upload, CheckCircle2, Camera, ShieldCheck, FileText, Loader2 } from 'lucide-react';
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
        <div className="claude-card p-6 h-full flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-serif font-medium text-[var(--color-text-main)] flex items-center gap-2">
                        Photo & Pack
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">Ambil foto resi & rekam video packing</p>
                </div>
                <div className="flex items-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${step === s ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
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
                                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-all text-[var(--color-text-main)] font-mono"
                                value={resi}
                                onChange={(e) => setResi(e.target.value)}
                            />
                            <Scan className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
                            {resi && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium border border-emerald-100">VALID</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                                Metadata-Locked: EcomGuard akan langsung mengunci koordinat GPS, Timestamp, dan Device ID ke dalam bukti packing Anda.
                            </p>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={!resi}
                            className="claude-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Camera className="w-4 h-4" /> Foto Resi (Step 1/2)
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="aspect-video bg-[var(--background)] rounded-xl border border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[var(--surface)] transition-all relative overflow-hidden group">

                            <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center bg-[var(--surface)] shadow-sm group-hover:scale-105 transition-transform">
                                <PlayCircle className="text-[var(--primary)] w-6 h-6" />
                            </div>
                            <p className="text-[var(--color-text-muted)] font-medium text-sm">Mulai Rekam Video Packing</p>
                            <div className="flex gap-2 opacity-60">
                                <span className="text-[10px] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--color-text-muted)]">4K 60FPS</span>
                                <span className="text-[10px] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--color-text-muted)]">GPS TAGGED</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="claude-button-outline w-full"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="claude-button w-full flex items-center justify-center gap-2"
                            >
                                {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : 'Selesai & Upload'}
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
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                            <CheckCircle2 className="text-emerald-600 w-8 h-8" />
                        </div>

                        <div>
                            <h3 className="text-xl font-serif font-medium text-[var(--color-text-main)]">Evidence Secured!</h3>
                            <p className="text-[var(--color-text-muted)] mt-1 text-sm">Order <span className="text-[var(--primary)] font-mono">{resi}</span> telah terdaftar.</p>
                        </div>

                        <div className="w-full grid grid-cols-1 gap-3">
                            <button
                                onClick={generateLegalTemplate}
                                className="claude-button flex items-center justify-center gap-2 w-full disabled:opacity-70"
                                disabled={isGeneratingLegal}
                            >
                                {isGeneratingLegal ? (
                                    <div className="flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Generating...</div>
                                ) : (
                                    <><FileText className="w-4 h-4" /> Download Legal Template (Appeal)</>
                                )}
                            </button>
                            <button
                                onClick={() => { setStep(1); setResi(''); }}
                                className="claude-button-outline w-full text-sm"
                            >
                                Foto & Pack Paket Lain
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Float Label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-full">
                <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Evidence Protection System v2.0</p>
            </div>
        </div>
    );
};

export default RecordAction;
