'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error: signInError } = await signIn(email, password);

        if (signInError) {
            setError(signInError.message);
            setIsLoading(false);
        } else {
            // Fetch session to get the user role for immediate redirect
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                const userRole = profile?.role;
                if (userRole === 'admin') router.push('/admin');
                else if (userRole === 'seller') router.push('/seller');
                else router.push('/');
            } else {
                router.push('/');
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-dark dark:text-white tracking-tight">
                            Seller<span className="text-primary">Guard</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-dark dark:text-white tracking-tight">Selamat Datang Kembali</h1>
                    <p className="text-dark/60 dark:text-white/60 mt-2">Masuk untuk mengamankan bisnismu</p>
                </div>

                <div className="glass-card p-8 bg-white dark:bg-white/5 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium"
                            >
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark/70 dark:text-white/70 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/30 dark:text-white/30 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-dark/[0.03] dark:bg-white/[0.03] border border-dark/5 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark dark:text-white font-medium"
                                    placeholder="admin@seller.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-dark/70 dark:text-white/70">Password</label>
                                <a href="#" className="text-xs font-bold text-primary hover:underline transition-all">Lupa?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/30 dark:text-white/30 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-dark/[0.03] dark:bg-white/[0.03] border border-dark/5 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark dark:text-white font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Masuk Ke Sistem <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-dark/5 dark:border-white/10 text-center">
                        <p className="text-sm text-dark/50 dark:text-white/50">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                                Daftar Sebagai Seller
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-8 text-xs text-dark/30 dark:text-white/30 uppercase tracking-[0.2em] font-bold">
                    Secure Truth Engine v4.0
                </p>
            </motion.div>
        </div>
    );
}
