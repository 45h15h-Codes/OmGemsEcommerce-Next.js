import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { WishlistItem, PaginatedResponse } from '@/types';

export const wishlistKeys = {
  all: ['wishlist'] as const,
  lists: () => [...wishlistKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...wishlistKeys.lists(), filters] as const,
};

export const useWishlist = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: wishlistKeys.list(filters),
    queryFn: () => api.get<PaginatedResponse<WishlistItem>>('/api/account/wishlist', { params: filters }),
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { diamond_id?: number; product_id?: number }) => 
      api.post<WishlistItem>('/api/account/wishlist', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/account/wishlist/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};
