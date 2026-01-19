'use client';

import React from 'react';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

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
                className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
                onClick={toggleColorBlind}
                className={`p-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium ${mode === 'colorblind'
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'hover:bg-[var(--border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
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
