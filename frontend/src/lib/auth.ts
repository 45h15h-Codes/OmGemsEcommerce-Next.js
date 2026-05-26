import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, initCsrf } from './apiClient';

// ─── Types ──────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roles: string[];
  permissions: string[];
  redirect_path: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearAuth: () => void;
  hasPermission: (perm: string) => boolean;
  hasRole: (role: string) => boolean;
}

// ─── Store ──────────────────────────────────────────────────

/**
 * Auth store — Task 2c: HttpOnly Cookie Model
 *
 * The Sanctum token is now stored in an HttpOnly cookie managed entirely
 * by the backend. This store NO LONGER holds or manages the raw token.
 * All authenticated requests automatically include the cookie via
 * axios `withCredentials: true`.
 *
 * What this store persists: user profile + isAuthenticated flag only.
 * The token itself never touches JS memory or localStorage.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      /**
       * Initialize auth on app mount. Called once by AuthProvider.
       * Validates session by calling /api/me — if the HttpOnly cookie
       * is present and valid, the user object is returned.
       */
      initializeAuth: async () => {
        const { isHydrated, isAuthenticated } = get();
        if (isHydrated) return; // Already initialized

        if (isAuthenticated) {
          set({ isLoading: true });
          try {
            const response = await apiClient.get('/api/me');
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
              isHydrated: true,
            });
          } catch {
            // Cookie expired or invalid — clear state silently
            get().clearAuth();
            set({ isHydrated: true });
          }
        } else {
          set({ isHydrated: true, isLoading: false });
        }
      },

      /**
       * Clear all client-side auth state.
       * The HttpOnly cookie is cleared by the server on logout.
       */
      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      /**
       * Login — CSRF handshake first, then POST credentials.
       * Backend sets the HttpOnly 'auth_token' cookie in the response.
       * We only persist the user object in the store.
       */
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          await initCsrf(); // Ensure CSRF token is set before state-mutating requests
          const response = await apiClient.post('/api/login', credentials);
          const { user } = response.data; // No access_token — it's in the HttpOnly cookie

          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      /**
       * Logout — tells the server to delete the token and expire the cookie.
       */
      logout: async () => {
        try {
          await apiClient.post('/api/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          get().clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      },

      getMe: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.get('/api/me');
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch {
          get().clearAuth();
        }
      },

      hasPermission: (perm) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'Super Admin') return true;
        return user.permissions.includes(perm);
      },

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        return user.roles.includes(role);
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user profile + auth flag — never persist a raw token
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
