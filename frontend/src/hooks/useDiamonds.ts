import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { Diamond, PaginatedResponse } from '@/types';

export const diamondKeys = {
  all: ['diamonds'] as const,
  lists: () => [...diamondKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...diamondKeys.lists(), filters] as const,
  details: () => [...diamondKeys.all, 'detail'] as const,
  detail: (id: number) => [...diamondKeys.details(), id] as const,
  
  adminLists: () => [...diamondKeys.all, 'admin', 'list'] as const,
  adminList: (filters: Record<string, any>) => [...diamondKeys.adminLists(), filters] as const,
  
  partnerLists: () => [...diamondKeys.all, 'partner', 'list'] as const,
  partnerList: (filters: Record<string, any>) => [...diamondKeys.partnerLists(), filters] as const,
};

export const useDiamonds = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: diamondKeys.list(filters),
    queryFn: () => api.get<PaginatedResponse<Diamond>>('/api/diamonds', { params: filters }),
  });
};

export const useDiamond = (id: number) => {
  return useQuery({
    queryKey: diamondKeys.detail(id),
    queryFn: () => api.get<Diamond>(`/api/diamonds/${id}`),
    enabled: !!id,
  });
};

// Admin
export const useAdminDiamonds = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: diamondKeys.adminList(filters),
    queryFn: () => api.get<PaginatedResponse<Diamond>>('/api/admin/diamonds', { params: filters }),
  });
};

export const useCreateAdminDiamond = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Diamond>) => api.post<Diamond>('/api/admin/diamonds', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diamondKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: diamondKeys.lists() });
    },
  });
};

export const useUpdateAdminDiamond = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Diamond> }) => 
      api.put<Diamond>(`/api/admin/diamonds/${id}`, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: diamondKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: diamondKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: diamondKeys.lists() });
    },
  });
};

export const useDeleteAdminDiamond = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/diamonds/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diamondKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: diamondKeys.lists() });
    },
  });
};

// Partner
export const usePartnerDiamonds = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: diamondKeys.partnerList(filters),
    queryFn: () => api.get<PaginatedResponse<Diamond>>('/api/partner/diamonds', { params: filters }),
  });
};

export const useCreatePartnerDiamond = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Diamond>) => api.post<Diamond>('/api/partner/diamonds', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diamondKeys.partnerLists() });
    },
  });
};

export const useUpdatePartnerDiamond = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Diamond> }) => 
      api.put<Diamond>(`/api/partner/diamonds/${id}`, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: diamondKeys.partnerLists() });
      queryClient.invalidateQueries({ queryKey: diamondKeys.detail(variables.id) });
    },
  });
};

export const useDeletePartnerDiamond = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/partner/diamonds/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diamondKeys.partnerLists() });
    },
  });
};

export const useTogglePartnerDiamond = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch<Diamond>(`/api/partner/diamonds/${id}/toggle-availability`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diamondKeys.partnerLists() });
      queryClient.invalidateQueries({ queryKey: diamondKeys.lists() });
    },
  });
};
