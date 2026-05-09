import axios, { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * Custom Error class to handle API errors, including validation errors.
 */
export class ApiError extends Error {
  public status?: number;
  public validationErrors?: Record<string, string[]>;

  constructor(message: string, status?: number, validationErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

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

// Response interceptor to handle 401 Unauthorized globally and unwrap errors into ApiError
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<unknown>) => {
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
    
    // Check if it's a 5xx error to potentially retry (simple implementation on interceptor level)
    if (error.response && error.response.status >= 500) {
      console.error('Server error encountered:', error.response.status);
    }
    
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const validationErrors = error.response?.data?.errors;
    const status = error.response?.status;
    
    return Promise.reject(new ApiError(message, status, validationErrors));
  }
);

/**
 * Unified API helper wrapped around apiClient for strongly typed requests.
 */
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },
  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};
