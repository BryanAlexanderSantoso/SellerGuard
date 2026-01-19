'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
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
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white">
                            <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-xl font-serif font-bold text-[var(--color-text-main)]">
                            EcomGuard
                        </span>
                    </Link>
                    <h1 className="text-2xl font-serif font-medium text-[var(--color-text-main)]">Selamat Datang</h1>
                    <p className="text-[var(--color-text-muted)] text-sm mt-2">Masuk untuk mengelola keamanan toko Anda</p>
                </div>

                {/* Card */}
                <div className="claude-card p-8 bg-[var(--surface)]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all text-sm text-[var(--color-text-main)]"
                                    placeholder="nama@toko.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs text-[var(--primary)] hover:underline">Lupa password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all text-sm text-[var(--color-text-main)]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="claude-button w-full flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-[var(--primary)] font-medium hover:underline">
                                Daftar Seller
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest opacity-60">
                        EcomGuard Security v4.0.1
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
