import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { Order, PaginatedResponse } from '@/types';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (role: string, filters: Record<string, unknown>) => [...orderKeys.lists(), role, filters] as const,
  detail: (id: number) => [...orderKeys.all, 'detail', id] as const,
};

export const useAdminOrders = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: orderKeys.list('admin', filters),
    queryFn: () => api.get<PaginatedResponse<Order>>('/api/admin/orders', { params: filters }),
  });
};

export const usePartnerOrders = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: orderKeys.list('partner', filters),
    queryFn: () => api.get<PaginatedResponse<Order>>('/api/partner/orders', { params: filters }),
  });
};

export const useWholesaleOrders = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: orderKeys.list('wholesale', filters),
    queryFn: () => api.get<PaginatedResponse<Order>>('/api/wholesale/orders', { params: filters }),
  });
};

export const useAccountOrders = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: orderKeys.list('account', filters),
    queryFn: () => api.get<PaginatedResponse<Order>>('/api/account/orders', { params: filters }),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      api.patch(`/api/admin/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
