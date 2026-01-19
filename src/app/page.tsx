'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Package, Search, UserCheck, ArrowRight, CheckCircle, Smartphone, Database, Lock, MessageSquare } from 'lucide-react';
import VerifiedBlacklist from '@/components/VerifiedBlacklist';
import { supabase } from '@/lib/supabase';

const roles = [
  {
    title: 'Seller',
    description: 'Lindungi UMKM-mu dari retur palsu. Catat bukti packing dan akses database blacklist.',
    icon: Package,
    link: '/seller',
    features: ['Upload Bukti Video', 'Database Blacklist', 'Win Rate Statistik']
  },
  {
    title: 'Buyer',
    description: 'Belanja aman dengan verifikasi unboxing. Pastikan paket sesuai deskripsi.',
    icon: Smartphone,
    link: '/verify/SG-12345',
    features: ['Panduan Unboxing', 'Scan QR Code', 'Kirim Bukti Instan']
  },
  {
    title: 'Admin',
    description: 'Verifikator ekosistem. Tinjau sengketa dan kelola laporan komunitas.',
    icon: Shield,
    link: '/admin',
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
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--primary)] selection:text-white">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--color-text-muted)] text-xs font-medium mb-8 shadow-sm">
            <Lock className="w-3 h-3 text-[var(--primary)]" />
            <span>Trusted by {totalUMKM.toLocaleString()}+ UMKM Indonesia</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif text-[var(--color-text-main)] mb-6 leading-[1.1]">
            Amankan Bisnismu dari <br />
            <span className="italic text-[var(--primary)]">Penipuan Retur Paket</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto mb-10 font-sans font-light">
            Satu platform terintegrasi untuk Seller, Buyer, dan Admin.
            Gunakan bukti digital sah secara hukum untuk melawan kecurangan.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/seller" className="claude-button flex items-center justify-center gap-2 shadow-sm">
              <MessageSquare className="w-4 h-4" />
              Coba EcomGuard Gratis
            </Link>
            <Link href="/how-it-works" className="claude-button-outline">
              Pelajari Cara Kerja
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Role Selection - Minimal Cards */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-serif text-[var(--foreground)]">Pilih Peranmu</h2>
          <p className="text-[var(--color-text-muted)] mt-2">Ekosistem yang adil untuk semua pihak.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="claude-card p-8 flex flex-col items-start bg-[var(--surface)]"
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--background)] flex items-center justify-center mb-6 text-[var(--primary)]">
                <role.icon className="w-6 h-6 stroke-[1.5]" />
              </div>

              <h3 className="text-xl font-serif font-medium text-[var(--color-text-main)] mb-3">{role.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8 flex-1">
                {role.description}
              </p>

              <div className="space-y-3 mb-8 w-full">
                {role.features.map(feat => (
                  <div key={feat} className="flex items-center gap-3 text-sm text-[var(--color-text-main)] opacity-80">
                    <CheckCircle className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>

              <Link
                href={role.link}
                className="w-full py-2.5 rounded-lg border border-[var(--border)] text-[var(--color-text-main)] text-sm font-medium hover:bg-[var(--background)] transition-colors text-center"
              >
                Masuk ke Console
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Highlight - Clean Layout */}
      <section className="py-24 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text-main)] mb-6">
                Teknologi Anti-Fraud <br />
                <span className="text-[var(--primary)] italic">Terdepan Untuk UMKM</span>
              </h2>

              <div className="space-y-8 mt-10">
                {[
                  {
                    title: "Cloud Evidence Vault",
                    desc: "Semua video packing dan unboxing tersimpan aman dan siap digunakan sebagai bukti sengketa.",
                    icon: Database
                  },
                  {
                    title: "Community Blacklist",
                    desc: "Data penipu dibagi secara real-time antar seller untuk pencegahan dini.",
                    icon: UserCheck
                  },
                  {
                    title: "Smart Verification",
                    desc: "Deteksi otomatis label resi dan tanda-tanda manipulasi dengan AI.",
                    icon: Search
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <item.icon className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--color-text-main)] mb-1">{item.title}</h4>
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center items-center">
              <div className="relative w-full max-w-[320px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/20 to-transparent blur-3xl opacity-30 rounded-full" />
                <Image
                  src="/images/dashboard-mockup-flat.png"
                  alt="EcomGuard Seller Dashboard Preview on iPhone"
                  width={600}
                  height={1200}
                  className="relative z-10 w-full h-auto drop-shadow-2xl rounded-[2.5rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blacklist Section - Simple & Direct */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-[var(--border)] pb-8">
          <div>
            <h2 className="text-3xl font-serif text-[var(--color-text-main)] mb-3">Waspada Fraud Hunter</h2>
            <p className="text-[var(--color-text-muted)] max-w-lg leading-relaxed">
              Daftar pembeli yang telah terverifikasi melakukan penipuan retur.
            </p>
          </div>
          <Link href="/blacklist" className="text-[var(--primary)] font-medium hover:underline flex items-center gap-1">
            Lihat Database <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VerifiedBlacklist />
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 border-t border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--primary)] rounded flex items-center justify-center text-white">
              <Shield className="w-3 h-3" />
            </div>
            <span className="font-serif font-bold text-[var(--color-text-main)]">EcomGuard</span>
          </div>
          <div className="flex gap-8 text-sm text-[var(--color-text-muted)]">
            <a href="#" className="hover:text-[var(--primary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors">Contact</a>
          </div>
          <div className="text-sm text-[var(--color-text-muted)] opacity-60">
            © 2026 EcomGuard
          </div>
        </div>
      </footer>
    </div>
  );
}
