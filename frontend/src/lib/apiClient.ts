import axios from 'axios';

/**
 * Configure global axios instance to interface with Laravel backend.
 * Includes credentials option crucial for Sanctum CSRF mechanism.
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
 * Must be called once before making state-mutating requests (POST, PUT, DELETE)
 * if the user is not yet authenticated or the session expired.
 */
export const initCsrf = async () => {
  await apiClient.get('/sanctum/csrf-cookie');
};

// Optional: Add request/response interceptors to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthenticated. Redirecting to login...');
      // Implement sign out or redirect to login page logic here
      // e.g. window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
