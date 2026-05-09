import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth';
import { api } from '@/lib/apiClient';

export const useLogin = () => {
  const login = useAuthStore(state => state.login);
  return useMutation({
    mutationFn: (credentials: unknown) => login(credentials),
  });
};

export const useLogout = () => {
  const logout = useAuthStore(state => state.logout);
  return useMutation({
    mutationFn: () => logout(),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: unknown) => {
      await api.get('/sanctum/csrf-cookie');
      return api.post('/api/register', data);
    }
  });
};
