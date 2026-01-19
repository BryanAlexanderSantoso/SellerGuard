'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'seller' | 'buyer')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, role, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (allowedRoles && role && !allowedRoles.includes(role)) {
                // If logged in but role not allowed, go back home
                router.push('/');
            }
        }
    }, [user, role, isLoading, router, allowedRoles]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
                    <p className="text-sm font-medium text-[var(--color-text-muted)] animate-pulse">Memuat Sesi...</p>
                </div>
            </div>
        );
    }

    if (!user || (allowedRoles && role && !allowedRoles.includes(role))) {
        return null;
    }

    return <>{children}</>;
}
