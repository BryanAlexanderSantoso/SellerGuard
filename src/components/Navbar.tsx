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
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${isScrolled ? 'bg-[var(--surface)] border-[var(--border)] shadow-sm' : 'bg-[var(--background)] border-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-md flex items-center justify-center text-white">
                        <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-lg font-serif font-bold text-[var(--color-text-main)]">
                        EcomGuard
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {role === 'admin' && (
                        <>
                            <Link href="/admin" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">Admin Console</Link>
                            <Link href="/blacklist" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">Moderation</Link>
                        </>
                    )}
                    {role === 'seller' && (
                        <>
                            <Link href="/seller" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">Dashboard</Link>
                            <Link href="/dispute" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">Disputes</Link>
                            <Link href="/blacklist" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">Blacklist</Link>
                        </>
                    )}
                    {role === 'buyer' && (
                        <>
                            <Link href="/buyer" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">My Orders</Link>
                            <Link href="/buyer/disputes" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">My Disputes</Link>
                            <Link href="/verify/new" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">Verify Package</Link>
                        </>
                    )}
                    {!user && (
                        <>
                            <Link href="/#features" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">Fitur</Link>
                            <Link href="/#roles" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">Solusi</Link>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <AccessibilityToggles />

                    {user ? (
                        <>
                            <button className="p-2 hover:bg-[var(--border)] rounded-full transition-colors relative">
                                <Bell className="w-5 h-5 text-[var(--color-text-muted)]" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>

                            <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-[var(--border)]">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[var(--border)] rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-[var(--color-text-muted)]" />
                                    </div>
                                    <span className="text-sm font-medium text-[var(--color-text-main)] max-w-[100px] truncate">
                                        {user.email?.split('@')[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={async () => {
                                        await signOut();
                                        window.location.href = '/';
                                    }}
                                    className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-red-500" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-[var(--border)]">
                            <Link href="/login" className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors">
                                Masuk
                            </Link>
                            <Link href="/register" className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm">
                                Daftar
                            </Link>
                        </div>
                    )}

                    <button
                        className="md:hidden p-2 hover:bg-[var(--border)] rounded-lg transition-colors text-[var(--color-text-main)]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[var(--surface)] border-b border-[var(--border)] overflow-hidden"
                    >
                        <div className="p-4 flex flex-col gap-2">
                            {/* ... (Mobile menu items simplified) ... */}
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-[var(--background)] text-sm font-medium text-[var(--color-text-main)]">Home</Link>
                            {!user && (
                                <>
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-[var(--background)] text-sm font-medium text-[var(--color-text-main)]">Masuk</Link>
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-lg bg-[var(--primary)] text-white text-sm font-medium text-center">Daftar</Link>
                                </>
                            )}
                            {user && (
                                <button onClick={async () => { await signOut(); setIsMobileMenuOpen(false); }} className="px-4 py-3 rounded-lg hover:bg-red-50 text-sm font-medium text-red-500 text-left flex items-center gap-2">
                                    <LogOut className="w-4 h-4" /> Keluar
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
