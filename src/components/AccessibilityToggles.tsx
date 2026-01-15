'use client';

import React from 'react';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { motion } from 'framer-motion';

const AccessibilityToggles = () => {
    const { theme, toggleTheme, mode, toggleColorBlind } = useAccessibility();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="flex gap-2"><div className="w-10 h-10" /><div className="w-10 h-10" /></div>;

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-dark/5 hover:bg-dark/10 dark:bg-white/5 dark:hover:bg-white/10 transition-all flex items-center justify-center text-dark/70 dark:text-white/70"
                title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
                onClick={toggleColorBlind}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-bold ${mode === 'colorblind'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-dark/5 hover:bg-dark/10 dark:bg-white/5 dark:hover:bg-white/10 text-dark/70 dark:text-white/70'
                    }`}
                title="Mode Aman Warna"
            >
                {mode === 'colorblind' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                <span className="hidden lg:block">{mode === 'colorblind' ? 'Colorblind On' : 'Colorblind Off'}</span>
            </button>
        </div>
    );
};

export default AccessibilityToggles;
