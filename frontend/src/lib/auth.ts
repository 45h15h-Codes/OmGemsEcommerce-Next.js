import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, initCsrf } from './apiClient';

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
  login: (credentials: any) => Promise<User>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
  hasRole: (role: string) => boolean;
  setToken: (token: string | null) => void;
}

// Helper to set cookie for middleware
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setToken: (token) => {
        set({ token });
        if (token) {
          setCookie('auth_token', token);
        } else {
          removeCookie('auth_token');
          removeCookie('user_role');
        }
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
          get().setToken(null);
          set({ user: null, isAuthenticated: false });
          window.location.href = '/auth/login';
        }
      },

      getMe: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.get('/api/me');
          set({ user: response.data, isAuthenticated: true, isLoading: false });
          setCookie('user_role', response.data.role); // Update role cookie
        } catch (error) {
          get().setToken(null);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      hasPermission: (perm) => {
        const { user } = get();
        if (!user) return false;
        // Super Admin has all permissions implicitly or explicitly
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
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
