'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Package, Search, UserCheck, ArrowRight, CheckCircle, Smartphone, Database, Lock } from 'lucide-react';
import VerifiedBlacklist from '@/components/VerifiedBlacklist';
import { supabase } from '@/lib/supabase';

const roles = [
  {
    title: 'Untuk Seller',
    description: 'Lindungi UMKM-mu dari retur palsu. Catat bukti packing, simpan video, dan akses database blacklist pembeli nakal.',
    icon: Package,
    link: '/seller',
    colorClass: 'emerald',
    features: ['Upload Bukti Video', 'Database Blacklist', 'Win Rate Statistik']
  },
  {
    title: 'Untuk Buyer',
    description: 'Belanja aman dengan verifikasi unboxing. Pastikan paket sesuai deskripsi dan punya bukti kuat jika ada kendala.',
    icon: Smartphone,
    link: '/verify/SG-12345',
    colorClass: 'blue',
    features: ['Panduan Unboxing', 'Scan QR Code', 'Kirim Bukti Instan']
  },
  {
    title: 'Untuk Admin',
    description: 'Verifikator ekosistem. Tinjau sengketa, kelola laporan komunitas, dan bersihkan marketplace dari penipu.',
    icon: Shield,
    link: '/admin',
    colorClass: 'rose',
    features: ['Review Sengketa', 'Manajemen Blacklist', 'Global Security Audit']
  }
];

export default function LandingPage() {
  const [totalUMKM, setTotalUMKM] = useState(10000);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from('stats')
        .select('value')
        .eq('key', 'total_umkm_users')
        .single();

      if (data?.value) {
        setTotalUMKM(Number(data.value));
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="relative overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">

      {/* YouTube Video Background with Correct Layering */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden z-0">
        {/* Overlay: Kurangi opacity sedikit lagi agar video makin jelas */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-slate-50/50 to-background dark:from-black/80 dark:via-black/60 dark:to-background z-20" />

        <iframe
          className="relative w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 object-cover pointer-events-none opacity-100 dark:opacity-50 grayscale-[10%] z-10"
          src="https://www.youtube.com/embed/zPKBl-KzbH4?autoplay=1&mute=1&controls=0&loop=1&playlist=zPKBl-KzbH4&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&origin=http://localhost:3000&enablejsapi=1"
          allow="autoplay; encrypted-media"
          title="Background Video"
        />
      </div>

      {/* Hero Section - Content layer di atas video */}
      <section className="relative pt-20 pb-24 text-center px-4 z-30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-8"
        >
          <Lock className="w-4 h-4" /> Trusted by {totalUMKM.toLocaleString()}+ UMKM Indonesia
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight"
        >
          Amankan Bisnismu Dari <br />
          <span className="text-gradient">Penipuan Retur Paket</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-white/60 leading-relaxed mb-12"
        >
          Satu platform terintegrasi untuk Seller, Buyer, dan Admin.
          Gunakan bukti digital sah secara hukum untuk melawan kecurangan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/seller" className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            Coba SellerGuard Gratis
          </Link>
          <Link href="/how-it-works" className="px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
            Pelajari Cara Kerja
          </Link>
        </motion.div>
      </section>

      {/* Role Selection Section */}
      <section id="roles" className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-dark dark:text-white mb-4 tracking-tight">Pilih Peranmu</h2>
          <p className="text-dark/60 dark:text-white/40 italic">Ekosistem yang adil untuk semua pihak dalam transaksi online</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 flex flex-col h-full group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:scale-110 ${role.colorClass === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/10' :
                role.colorClass === 'blue' ? 'bg-blue-500/10 border-blue-500/10' :
                  'bg-rose-500/10 border-rose-500/10'
                }`}>
                <role.icon className={`w-8 h-8 ${role.colorClass === 'emerald' ? 'text-emerald-600' :
                  role.colorClass === 'blue' ? 'text-blue-600' :
                    'text-rose-600'
                  }`} />
              </div>

              <h3 className="text-2xl font-bold text-dark dark:text-white mb-4 tracking-tight">{role.title}</h3>
              <p className="text-dark/60 dark:text-white/60 leading-relaxed mb-8 flex-1">
                {role.description}
              </p>

              <div className="space-y-4 mb-10">
                {role.features.map(feat => (
                  <div key={feat} className="flex items-center gap-2 text-sm font-semibold text-dark/70 dark:text-white/70">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${role.colorClass === 'emerald' ? 'text-emerald-500' :
                      role.colorClass === 'blue' ? 'text-blue-500' :
                        'text-rose-500'
                      }`} />
                    {feat}
                  </div>
                ))}
              </div>

              <Link
                href={role.link}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${role.colorClass === 'emerald' ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/20' :
                  role.colorClass === 'blue' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
                    'bg-rose-500 text-white shadow-lg shadow-rose-200'
                  } hover:brightness-110`}
              >
                Masuk ke Console <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blacklist Hall of Shame / Landing Feature */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Waspada <span className="text-rose-500 underline decoration-rose-500/30">Fraud Hunter</span>
            </h2>
            <p className="text-slate-600 dark:text-white/60 font-medium max-w-xl leading-relaxed">
              Daftar pembeli yang telah terverifikasi melakukan penipuan retur atau manipulasi paket secara sistematis oleh tim Admin SellerGuard.
            </p>
          </div>
          <Link href="/blacklist" className="px-6 py-3 bg-rose-500/10 text-rose-600 font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all text-sm">
            Lihat Database Lengkap
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <VerifiedBlacklist />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-slate-50 dark:bg-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
                Teknologi <span className="text-primary">Anti-Fraud</span> <br />
                Terdepan Untuk UMKM
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Cloud Evidence Vault</h4>
                    <p className="text-slate-600 dark:text-white/60">Semua video packing dan unboxing tersimpan aman di server kami, siap digunakan sebagai bukti sengketa di marketplace mana pun.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Community Blacklist</h4>
                    <p className="text-slate-600 dark:text-white/60">Terhubung dengan ribuan seller lain untuk berbagi data penipu secara real-time. Cegah penipuan sebelum terjadi.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Smart Verification</h4>
                    <p className="text-slate-600 dark:text-white/60">Deteksi otomatis label resi dan tanda-tanda manipulasi video menggunakan teknologi verifikasi cerdas.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex justify-center items-center"
            >
              {/* iPhone 17 Frame Mockup */}
              <div className="relative w-[320px] h-[650px] bg-[#0a0c10] rounded-[3.5rem] border-[8px] border-[#1f2937] shadow-2xl overflow-hidden group">
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />

                {/* Content / App Screenshot */}
                <div className="absolute inset-0 z-10">
                  <img
                    src="/images/iphone-preview.png"
                    alt="SellerGuard iPhone 17 Preview"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Glass Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-20 pointer-events-none" />
              </div>

              {/* Decorative Glows */}
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] -z-10 animate-pulse" />
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -z-10" />

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-1/4 glass p-4 rounded-2xl shadow-2xl z-30 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-dark/40 dark:text-white/40">Security Status</p>
                    <p className="text-sm font-bold text-dark dark:text-white">Active Protection</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-dark/5 dark:border-white/5 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-dark dark:text-white tracking-tight">
              Seller<span className="text-primary">Guard</span>
            </span>
          </div>
          <p className="text-dark/40 dark:text-white/40 text-sm">© 2026 SellerGuard Ecosystem. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-bold text-dark/70 dark:text-white/70">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
