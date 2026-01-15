'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Bell, User, LogOut } from 'lucide-react';
import AccessibilityToggles from './AccessibilityToggles';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, role, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`w-full max-w-7xl flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${isScrolled
                    ? 'glass shadow-2xl py-4 dark:bg-black/80'
                    : 'bg-white/60 dark:bg-white/5 backdrop-blur-md border border-dark/5 dark:border-white/10'
                    }`}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Shield className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Seller<span className="text-primary">Guard</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {role === 'admin' && (
                        <>
                            <Link href="/admin" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">Admin Console</Link>
                            <Link href="/blacklist" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">Moderation</Link>
                        </>
                    )}
                    {role === 'seller' && (
                        <>
                            <Link href="/seller" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">Dashboard</Link>
                            <Link href="/dispute" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">Disputes</Link>
                            <Link href="/blacklist" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">Blacklist</Link>
                        </>
                    )}
                    {role === 'buyer' && (
                        <>
                            <Link href="/buyer" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">My Orders</Link>
                            <Link href="/buyer/disputes" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">My Disputes</Link>
                            <Link href="/verify/new" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">Verify Package</Link>
                        </>
                    )}
                    {!user && (
                        <>
                            <Link href="/#features" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">Fitur</Link>
                            <Link href="/#roles" className="text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">Solusi</Link>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <AccessibilityToggles />

                    {user ? (
                        <>
                            <button className="p-2 hover:bg-emerald-50 dark:hover:bg-white/5 rounded-full transition-colors relative">
                                <Bell className="w-5 h-5 text-slate-600 dark:text-white/70" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0c10]"></span>
                            </button>

                            <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-sage-accent dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary-dark dark:text-primary" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white max-w-[100px] truncate">
                                        {user.email?.split('@')[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={async () => {
                                        await signOut();
                                        window.location.href = '/';
                                    }}
                                    className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-all group"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-white/10">
                            <Link href="/login" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors">
                                Masuk
                            </Link>
                            <Link href="/register" className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                Daftar
                            </Link>
                        </div>
                    )}

                    <button
                        className="md:hidden p-2 hover:bg-emerald-50 dark:hover:bg-white/5 rounded-full transition-colors text-slate-900 dark:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-x-4 top-24 glass p-6 rounded-3xl md:hidden flex flex-col gap-4 shadow-2xl dark:bg-black/80"
                    >
                        {role === 'admin' && (
                            <>
                                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">Admin Console</Link>
                                <Link href="/blacklist" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">Moderation</Link>
                            </>
                        )}
                        {role === 'seller' && (
                            <>
                                <Link href="/seller" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">Dashboard</Link>
                                <Link href="/dispute" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">Disputes</Link>
                                <Link href="/blacklist" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">Blacklist</Link>
                            </>
                        )}
                        {role === 'buyer' && (
                            <>
                                <Link href="/buyer" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">My Orders</Link>
                                <Link href="/buyer/disputes" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">My Disputes</Link>
                                <Link href="/verify/new" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">Verify Package</Link>
                            </>
                        )}
                        {!user && (
                            <>
                                <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">Fitur</Link>
                                <Link href="/#roles" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-3 hover:bg-primary/10 rounded-xl transition-colors">Solusi</Link>
                            </>
                        )}
                        <hr className="border-slate-200 dark:border-white/10 my-2" />

                        {user ? (
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-sage-accent dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary-dark dark:text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{user.email?.split('@')[0]}</p>
                                        <p className="text-xs text-slate-500 dark:text-white/50">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={async () => {
                                        await signOut();
                                        setIsMobileMenuOpen(false);
                                        window.location.href = '/';
                                    }}
                                    className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl"
                                >
                                    <LogOut className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-4 text-center font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-4 text-center font-bold bg-primary text-white rounded-2xl shadow-lg shadow-primary/20"
                                >
                                    Daftar Sekarang
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
