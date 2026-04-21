'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';

/**
 * AuthProvider — calls initializeAuth() once on mount.
 * This validates the persisted token against /api/me on page load
 * and sets isHydrated = true when done.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
