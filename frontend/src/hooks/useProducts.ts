import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { Product, PaginatedResponse } from '@/types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), filters] as const,
  
  adminLists: () => [...productKeys.all, 'admin', 'list'] as const,
  adminList: (filters: Record<string, any>) => [...productKeys.adminLists(), filters] as const,
};

export const useProducts = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => api.get<PaginatedResponse<Product>>('/api/products', { params: filters }),
  });
};

export const useAdminProducts = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: productKeys.adminList(filters),
    queryFn: () => api.get<PaginatedResponse<Product>>('/api/admin/products', { params: filters }),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => api.post<Product>('/api/admin/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) => 
      api.put<Product>(`/api/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};
