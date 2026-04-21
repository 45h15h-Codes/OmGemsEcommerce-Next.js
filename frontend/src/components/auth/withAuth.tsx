'use client';

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface WithAuthOptions {
  /** Required roles — user must have at least one of these roles */
  roles?: string[];
  /** Required permissions — user must have ALL of these permissions */
  permissions?: string[];
  /** Where to redirect unauthorized users (default: /auth/login) */
  redirectTo?: string;
}

/**
 * Higher-Order Component for role/permission-based page protection.
 * 
 * Usage:
 * ```tsx
 * export default withAuth(MyPage, { 
 *   roles: ['Super Admin', 'Admin'],
 *   permissions: ['manage_users'] 
 * });
 * ```
 * 
 * The wrapped component receives the same props as the original,
 * but will only render if the user satisfies the role/permission checks.
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { roles, permissions, redirectTo = '/auth/login' } = options;

  function AuthGuard(props: P) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, isHydrated, hasRole, hasPermission } = useAuthStore();

    useEffect(() => {
      // Wait until auth is fully hydrated before making decisions
      if (!isHydrated || isLoading) return;

      // Not authenticated → redirect to login
      if (!isAuthenticated || !user) {
        router.replace(redirectTo);
        return;
      }

      // Check roles (user must have at least one)
      if (roles && roles.length > 0) {
        const hasAnyRole = roles.some((role) => hasRole(role));
        if (!hasAnyRole) {
          router.replace(redirectTo);
          return;
        }
      }

      // Check permissions (user must have all)
      if (permissions && permissions.length > 0) {
        const hasAllPermissions = permissions.every((perm) => hasPermission(perm));
        if (!hasAllPermissions) {
          router.replace(redirectTo);
          return;
        }
      }
    }, [isHydrated, isLoading, isAuthenticated, user, router, hasRole, hasPermission]);

    // Show loading state while auth is initializing
    if (!isHydrated || isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSkeleton variant="dashboard" />
        </div>
      );
    }

    // Not authenticated or missing required role/permission
    if (!isAuthenticated || !user) {
      return null; // Will redirect via useEffect
    }

    if (roles && roles.length > 0) {
      const hasAnyRole = roles.some((role) => hasRole(role));
      if (!hasAnyRole) return null;
    }

    if (permissions && permissions.length > 0) {
      const hasAllPermissions = permissions.every((perm) => hasPermission(perm));
      if (!hasAllPermissions) return null;
    }

    return <WrappedComponent {...props} />;
  }

  AuthGuard.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthGuard;
}
