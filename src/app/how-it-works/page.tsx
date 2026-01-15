'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Package, Video, Users, Database, ArrowRight, CheckCircle2, Lock, Eye, MousePointer2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
    const steps = [
        {
            title: 'Seller Mencatat Bukti',
            description: 'Penjual merekam video saat membungkus paket. Sistem kami mengunci metadata (waktu, lokasi, ID perangkat) agar bukti tidak bisa dimanipulasi.',
            analogy: 'Ibarat Notaris Digital yang mencatat detik demi detik persiapan paket Anda agar sah di mata hukum.',
            icon: Package,
            color: 'emerald'
        },
        {
            title: 'Aman di Vault Cloud',
            description: 'Video tidak disimpan di HP, tapi langsung ke brankas digital SellerGuard. Ini menjamin bukti tidak sengaja terhapus atau diedit.',
            analogy: 'Ibarat Brankas Bank di mana kunci pembukanya dipegang bersama oleh sistem keamanan tingkat tinggi.',
            icon: Database,
            color: 'blue'
        },
        {
            title: 'Buyer Verifikasi Unboxing',
            description: 'Pembeli merekam video saat membuka paket. Sistem mencocokkan kondisi paket saat dikirim dan saat diterima secara transparan.',
            analogy: 'Ibarat Cermin Kejujuran. Kedua pihak melihat hal yang sama tanpa ada yang bisa berbohong.',
            icon: Video,
            color: 'amber'
        },
        {
            title: 'Mediasi Adil (Jika Ada Masalah)',
            description: 'Jika terjadi sengketa, Admin meninjau kedua video secara berdampingan. Keputusan diambil berdasarkan bukti digital yang valid.',
            analogy: 'Ibarat Hakim yang memiliki rekaman CCTV dari dua sudut pandang berbeda untuk menentukan siapa yang benar.',
            icon: Shield,
            color: 'rose'
        }
    ];

    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 dark:from-primary/5 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />

            <main className="max-w-5xl mx-auto px-6 py-20 pt-32">
                {/* Hero Section */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-white/5 text-primary dark:text-primary-light text-xs font-black uppercase tracking-widest mb-6 border border-primary/10 dark:border-white/5"
                    >
                        <Lock className="w-4 h-4" /> Security Protocol v2.0
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black text-dark dark:text-white tracking-tight mb-8"
                    >
                        Bagaimana SellerGuard <br />
                        <span className="text-primary font-serif italic">Melindungi</span> Anda?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-dark/60 dark:text-white/60 max-w-3xl mx-auto leading-relaxed italic"
                    >
                        "Bayangkan SellerGuard sebagai saksi kunci yang tidak pernah tidur,
                        mencatat setiap kejujuran dalam setiap paket yang Anda kirim atau terima."
                    </motion.p>
                </div>

                {/* Steps Section */}
                <div className="space-y-12 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[31px] top-10 bottom-10 w-0.5 bg-dark/5 dark:bg-white/5 hidden md:block" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex flex-col md:flex-row gap-8 items-start group"
                        >
                            {/* Step Number/Icon */}
                            <div className={`w-16 h-16 shrink-0 rounded-[1.5rem] flex items-center justify-center bg-white dark:bg-slate-900 border border-dark/5 dark:border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500 z-10 ${step.color === 'emerald' ? 'text-emerald-500' :
                                step.color === 'blue' ? 'text-blue-500' :
                                    step.color === 'amber' ? 'text-amber-500' : 'text-rose-500'
                                }`}>
                                <step.icon className="w-8 h-8" />
                            </div>

                            <div className="flex-1 glass-card p-10 hover:border-primary/20 dark:hover:border-primary/40 transition-all dark:bg-white/5 shadow-2xl shadow-black/5 dark:shadow-black/20">
                                <h3 className="text-2xl font-black text-dark dark:text-white mb-4 tracking-tight flex items-center gap-3">
                                    <span className="text-sm font-mono text-dark/20 dark:text-white/20">0{index + 1}.</span>
                                    {step.title}
                                </h3>
                                <p className="text-dark/60 dark:text-white/60 leading-relaxed mb-6 font-medium">
                                    {step.description}
                                </p>

                                <div className={`p-5 rounded-2xl flex items-start gap-4 italic text-sm ${step.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20' :
                                    step.color === 'blue' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20' :
                                        step.color === 'amber' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-500/20' :
                                            'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-500/20'
                                    }`}>
                                    <div className="mt-1"><MousePointer2 className="w-4 h-4" /></div>
                                    <p><span className="font-bold opacity-70">Analoginya:</span> {step.analogy}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Blacklist Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 rounded-[3.5rem] p-12 md:p-20 bg-gradient-to-br from-dark to-slate-900 dark:from-emerald-900 dark:to-slate-900 text-white relative overflow-hidden text-center shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Users className="w-80 h-80" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-emerald-400 text-xs font-black uppercase tracking-widest mb-8 border border-white/10">
                            <ShieldAlert className="w-4 h-4" /> Community Powered Security
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Kekuatan <span className="text-emerald-400">Komunitas</span></h2>
                        <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium italic">
                            "Ecosystem Blacklist kami bekerja seperti Siskamling Digital. Jika satu toko kena tipu,
                            ribuan toko lainnya akan langsung waspada terhadap nomor HP atau username penipu tersebut."
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-base font-bold hover:bg-white/10 transition-all">
                                <CheckCircle2 className="text-emerald-400 w-6 h-6" /> 24/7 Security Audit
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-base font-bold hover:bg-white/10 transition-all">
                                <CheckCircle2 className="text-emerald-400 w-6 h-6" /> Global Network Block
                            </div>
                        </div>
                    </div>

                    {/* Decorative radial gradient */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -z-0" />
                </motion.div>

                {/* Final Call to Action */}
                <div className="mt-40 text-center pb-20">
                    <h2 className="text-4xl font-black text-dark dark:text-white mb-10 tracking-tight">Siap Membangun Bisnis <br className="md:hidden" /> Yang Lebih Aman?</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <Link href="/seller" className="px-12 py-5 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-lg">
                            Daftar Sebagai Seller
                        </Link>
                        <Link href="/" className="px-12 py-5 bg-white dark:bg-white/5 border border-dark/10 dark:border-white/10 text-dark dark:text-white font-bold rounded-2xl hover:bg-dark/[0.02] dark:hover:bg-white/10 transition-all text-lg">
                            Cek Status Paket Saya
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer Sublabel */}
            <div className="text-center py-10 opacity-20 dark:opacity-40">
                <p className="text-[10px] font-bold text-dark dark:text-white uppercase tracking-[0.5em]">End-to-End Truth Engine v4.0.1</p>
            </div>
        </div>
    );
}
