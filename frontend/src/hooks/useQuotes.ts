import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { Quote, PaginatedResponse } from '@/types';

export const quoteKeys = {
  all: ['quotes'] as const,
  lists: () => [...quoteKeys.all, 'list'] as const,
  list: (role: string, filters: Record<string, any>) => [...quoteKeys.lists(), role, filters] as const,
};

export const useWholesaleQuotes = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: quoteKeys.list('wholesale', filters),
    queryFn: () => api.get<PaginatedResponse<Quote>>('/api/wholesale/quotes', { params: filters }),
  });
};

export const useSubmitQuote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<Quote>('/api/wholesale/quotes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all });
    },
  });
};
