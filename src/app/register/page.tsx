'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Truck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'seller' | 'buyer'>('seller');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error: signUpError } = await signUp(email, password, fullName, role);

        if (signUpError) {
            console.error('Registration failed:', signUpError);
            setError(signUpError.message);
            setIsLoading(false);
        } else {
            console.log('Registration success, checking session...');
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Email confirmation is OFF, we can go straight to dashboard
                if (role === 'seller') router.push('/seller');
                else router.push('/');
            } else {
                // Email confirmation is still ON, must go to login
                router.push('/login');
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
                    <h1 className="text-2xl font-serif font-medium text-[var(--color-text-main)]">Bergabung</h1>
                    <p className="text-[var(--color-text-muted)] text-sm mt-2">Buat akun baru untuk memulai</p>
                </div>

                {/* Card */}
                <div className="claude-card p-8 bg-[var(--surface)]">
                    <div className="flex gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('seller')}
                            className={`flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${role === 'seller'
                                ? 'border-[var(--primary)] bg-[var(--background)] text-[var(--primary)] shadow-sm'
                                : 'border-[var(--border)] text-[var(--color-text-muted)] hover:bg-[var(--background)]'
                                }`}
                        >
                            <Truck className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Seller</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('buyer')}
                            className={`flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${role === 'buyer'
                                ? 'border-[var(--primary)] bg-[var(--background)] text-[var(--primary)] shadow-sm'
                                : 'border-[var(--border)] text-[var(--color-text-muted)] hover:bg-[var(--background)]'
                                }`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Buyer</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all text-sm text-[var(--color-text-main)]"
                                    placeholder="Nama Lengkap"
                                />
                            </div>
                        </div>

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
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all text-sm text-[var(--color-text-main)]"
                                    placeholder="Minimal 8 karakter"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="claude-button w-full flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Buat Akun'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
                                Masuk Disini
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
