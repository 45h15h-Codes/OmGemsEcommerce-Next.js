import axios from 'axios';

/**
 * Configure global axios instance to interface with Laravel backend.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});

/**
 * Perform a Sanctum CSRF-cookie initialization request.
 */
export const initCsrf = async () => {
  await apiClient.get('/sanctum/csrf-cookie');
};

// Request interceptor to inject Bearer token
apiClient.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    // Read token from cookie
    const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
    if (match && match[2]) {
      config.headers.Authorization = `Bearer ${decodeURIComponent(match[2])}`;
    }
  }
  return config;
});

// Response interceptor to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthenticated. Redirecting to login...');
      if (typeof document !== 'undefined') {
        const pastDate = 'Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = `auth_token=; path=/; expires=${pastDate};`;
        document.cookie = `user_role=; path=/; expires=${pastDate};`;
        localStorage.removeItem('auth-storage');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
