'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, CheckCircle2, Package, Shield, Video } from 'lucide-react';

const steps = [
    {
        title: 'Halo Juragan! 👋',
        description: 'Mari amankan paketmu dari penipuan pengembalian dalam 3 langkah mudah. Kami siap melindungimu!',
        icon: Shield,
        color: 'emerald'
    },
    {
        title: '1. Scan Resi 🔍',
        description: 'Sebelum bungkus, scan barcode resi atau ketik manual. Ini untuk menandai paket yang kamu kerjakan.',
        icon: Package,
        color: 'blue'
    },
    {
        title: '2. Rekam Bukti 📹',
        description: 'Rekam video packing sebagai bukti sah secara hukum (UU ITE) jika pembeli nakal ingin menipumu.',
        icon: Video,
        color: 'primary'
    },
    {
        title: '3. Kamu Aman! ✅',
        description: 'Data tersimpan di cloud kami. Kalau pembeli lapor rusak padahal kamu benar, kamu punya bukti kuat!',
        icon: CheckCircle2,
        color: 'emerald'
    }
];

const OnboardingTour = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            setIsOpen(true);
        }
    }, []);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            closeTour();
        }
    };

    const closeTour = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenTour', 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-dark/40 backdrop-blur-md"
                        onClick={closeTour}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg glass bg-white p-8 rounded-[40px] shadow-2xl overflow-hidden"
                    >
                        {/* Background Accent */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                        <button
                            onClick={closeTour}
                            className="absolute top-6 right-6 p-2 hover:bg-dark/5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-dark/40" />
                        </button>

                        <div className="relative z-10">
                            <div className="flex flex-col items-center text-center">
                                <motion.div
                                    key={currentStep}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8"
                                >
                                    {React.createElement(steps[currentStep].icon, { className: "w-10 h-10 text-primary" })}
                                </motion.div>

                                <motion.h2
                                    key={`title-${currentStep}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl font-bold text-dark mb-4"
                                >
                                    {steps[currentStep].title}
                                </motion.h2>

                                <motion.p
                                    key={`desc-${currentStep}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-dark/60 leading-relaxed mb-10"
                                >
                                    {steps[currentStep].description}
                                </motion.p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${currentStep === i ? 'w-8 bg-primary' : 'w-2 bg-primary/20'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="bg-primary text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                >
                                    {currentStep === steps.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingTour;
