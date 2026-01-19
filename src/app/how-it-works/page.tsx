'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Package, Video, Users, Database, ArrowRight, CheckCircle2, Lock, Eye, MousePointer2 } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
    const steps = [
        {
            title: 'Seller Mencatat Bukti',
            description: 'Penjual merekam video saat membungkus paket. Sistem kami mengunci metadata (waktu, lokasi, ID perangkat) agar bukti tidak bisa dimanipulasi.',
            analogy: 'Ibarat Notaris Digital yang mencatat detik demi detik persiapan paket Anda agar sah di mata hukum.',
            icon: Package,
        },
        {
            title: 'Aman di Vault Cloud',
            description: 'Video tidak disimpan di HP, tapi langsung ke brankas digital EcomGuard. Ini menjamin bukti tidak sengaja terhapus atau diedit.',
            analogy: 'Ibarat Brankas Bank di mana kunci pembukanya dipegang bersama oleh sistem keamanan tingkat tinggi.',
            icon: Database,
        },
        {
            title: 'Buyer Verifikasi Unboxing',
            description: 'Pembeli merekam video saat membuka paket. Sistem mencocokkan kondisi paket saat dikirim dan saat diterima secara transparan.',
            analogy: 'Ibarat Cermin Kejujuran. Kedua pihak melihat hal yang sama tanpa ada yang bisa berbohong.',
            icon: Video,
        },
        {
            title: 'Mediasi Adil (Jika Ada Masalah)',
            description: 'Jika terjadi sengketa, Admin meninjau kedua video secara berdampingan. Keputusan diambil berdasarkan bukti digital yang valid.',
            analogy: 'Ibarat Hakim yang memiliki rekaman CCTV dari dua sudut pandang berbeda untuk menentukan siapa yang benar.',
            icon: Shield,
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-20">
            <main className="max-w-4xl mx-auto px-6">

                {/* Hero Section */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium uppercase tracking-widest mb-6"
                    >
                        <Lock className="w-3 h-3" /> Security Protocol v2.0
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-6"
                    >
                        Bagaimana EcomGuard <br />
                        <span className="text-[var(--color-text-muted)] italic">Melindungi Anda?</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
                    >
                        "Bayangkan EcomGuard sebagai saksi kunci yang tidak pernah tidur,
                        mencatat setiap kejujuran dalam setiap paket yang Anda kirim atau terima."
                    </motion.p>
                </div>

                {/* Steps Section */}
                <div className="space-y-8 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gray-200 hidden md:block" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex flex-col md:flex-row gap-6 items-start group"
                        >
                            {/* Step Number/Icon */}
                            <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-white border border-gray-200 shadow-sm z-10 group-hover:border-gray-300 transition-colors">
                                <step.icon className="w-6 h-6 text-gray-700" />
                            </div>

                            <div className="flex-1 claude-card p-8 bg-white hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-mono text-gray-400">STEP 0{index + 1}</span>
                                    <h3 className="text-xl font-serif font-semibold text-gray-900">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {step.description}
                                </p>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-3 text-sm text-gray-600 italic">
                                    <div className="mt-1 shrink-0"><MousePointer2 className="w-4 h-4 text-gray-400" /></div>
                                    <p><span className="font-semibold text-gray-800 not-italic">Analoginya:</span> {step.analogy}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Community Section - Simplistic Gray */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 p-10 bg-gray-900 rounded-2xl text-white text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-medium uppercase tracking-widest mb-6 border border-white/10">
                            <Users className="w-3 h-3" /> Community Power
                        </div>
                        <h2 className="text-3xl font-serif font-bold mb-4">Kekuatan Komunitas</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed text-lg">
                            Jika satu toko kena tipu, ribuan toko lainnya akan langsung waspada.
                            Ini adalah sistem pertahanan bersama.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm text-gray-300 font-medium">
                                <CheckCircle2 className="w-4 h-4" /> 24/7 Audit
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm text-gray-300 font-medium">
                                <CheckCircle2 className="w-4 h-4" /> Global Block
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <div className="mt-24 text-center">
                    <h2 className="text-3xl font-serif font-bold text-[var(--color-text-main)] mb-8">
                        Siap Mengamankan Bisnis Anda?
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/seller" className="claude-button">
                            Daftar Sebagai Seller
                        </Link>
                        <Link href="/" className="claude-button-outline">
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
