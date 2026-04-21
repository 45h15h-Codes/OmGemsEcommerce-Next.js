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
  token: string | null;
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
  setToken: (token: string | null) => void;
}

// ─── Cookie helpers ─────────────────────────────────────────

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document !== 'undefined') {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }
};

const removeCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
};

// ─── Store ──────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,   // Start false — no flash on initial render
      isHydrated: false,  // Tracks whether Zustand has rehydrated from localStorage

      setToken: (token) => {
        set({ token });
        if (token) {
          setCookie('auth_token', token);
        } else {
          removeCookie('auth_token');
          removeCookie('user_role');
        }
      },

      /**
       * Initialize auth on app mount. Called once by AuthProvider.
       * - If a token exists in persisted state, validates it with /api/me
       * - If token is invalid/expired, clears auth state silently
       * - Sets isHydrated = true when done
       */
      initializeAuth: async () => {
        const { token, isHydrated } = get();
        if (isHydrated) return; // Already initialized

        if (token) {
          set({ isLoading: true });
          try {
            const response = await apiClient.get('/api/me');
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
              isHydrated: true,
            });
            setCookie('user_role', response.data.role);
          } catch {
            // Token expired or invalid — clear silently
            get().clearAuth();
            set({ isHydrated: true });
          }
        } else {
          set({ isHydrated: true, isLoading: false });
        }
      },

      /**
       * Clear all auth state and cookies. Used on logout and token expiry.
       */
      clearAuth: () => {
        removeCookie('auth_token');
        removeCookie('user_role');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          await initCsrf(); // Ensure CSRF token is set before state-mutating requests
          const response = await apiClient.post('/api/login', credentials);
          const { access_token, user } = response.data;
          
          get().setToken(access_token);
          setCookie('user_role', user.role); // For middleware

          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          if (get().token) {
            await apiClient.post('/api/logout');
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          get().clearAuth();
          window.location.href = '/auth/login';
        }
      },

      getMe: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.get('/api/me');
          set({ user: response.data, isAuthenticated: true, isLoading: false });
          setCookie('user_role', response.data.role); // Update role cookie
        } catch {
          get().clearAuth();
        }
      },

      hasPermission: (perm) => {
        const { user } = get();
        if (!user) return false;
        // Super Admin has all permissions implicitly
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
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After Zustand rehydrates from localStorage, keep isLoading false
        // The actual validation happens in initializeAuth()
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
