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
 *
 * Security (Task 2c — HttpOnly Cookie Auth):
 *   - withCredentials: true  → sends the HttpOnly 'auth_token' cookie automatically
 *   - withXSRFToken: true    → sends Laravel's XSRF-TOKEN cookie as X-XSRF-TOKEN header
 *   - NO manual Bearer token injection — the server reads the HttpOnly cookie directly.
 *     This removes the XSS attack surface of JS-accessible tokens.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,   // Required: sends HttpOnly cookie on cross-origin requests
  withXSRFToken: true,     // Required: sends CSRF token header automatically
});

/**
 * Perform a Sanctum CSRF-cookie initialization request.
 * Must be called before any state-mutating request (login, register).
 */
export const initCsrf = async () => {
  await apiClient.get('/sanctum/csrf-cookie');
};

// Response interceptor — handle 401 Unauthorized globally and unwrap errors into ApiError
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    if (error.response?.status === 401) {
      console.warn('Unauthenticated. Redirecting to login...');
      // No cookie manipulation needed — the server expires the HttpOnly cookie on logout.
      // We only clear client-side state here.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        window.location.href = '/auth/login';
      }
    }

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
