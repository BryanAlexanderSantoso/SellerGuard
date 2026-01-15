'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type AccessibilityMode = 'standard' | 'colorblind';

interface AccessibilityContextType {
    theme: Theme;
    toggleTheme: () => void;
    mode: AccessibilityMode;
    toggleColorBlind: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mode, setMode] = useState<AccessibilityMode>('standard');

    useEffect(() => {
        const savedTheme = localStorage.getItem('sg-theme') as Theme;
        const savedMode = localStorage.getItem('sg-mode') as AccessibilityMode;
        if (savedTheme) setTheme(savedTheme);
        if (savedMode) setMode(savedMode);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        const body = window.document.body;

        [root, body].forEach(el => {
            el.classList.remove('light', 'dark');
            el.classList.add(theme);
        });
        localStorage.setItem('sg-theme', theme);

        [root, body].forEach(el => {
            if (mode === 'colorblind') {
                el.classList.add('colorblind');
            } else {
                el.classList.remove('colorblind');
            }
        });
        localStorage.setItem('sg-mode', mode);
    }, [theme, mode]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggleColorBlind = () => setMode(prev => prev === 'standard' ? 'colorblind' : 'standard');

    return (
        <AccessibilityContext.Provider value={{ theme, toggleTheme, mode, toggleColorBlind }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
}
