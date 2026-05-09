import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import type { NavLink, SiteSetting } from '@/types';

// ─── Query Key Factory ──────────────────────────────────────

export const siteContentKeys = {
  all: ['site-content'] as const,
  navLinks: () => [...siteContentKeys.all, 'nav-links'] as const,
  navLinksByLocation: (location: string) => [...siteContentKeys.navLinks(), location] as const,
  settings: () => [...siteContentKeys.all, 'settings'] as const,
};

// ─── Hooks ──────────────────────────────────────────────────

/**
 * Fetch nav links from the CMS backend, filtered by location.
 * Uses a 5-minute staleTime since nav links rarely change.
 */
export const useNavLinks = (location?: 'header' | 'footer') => {
  return useQuery<NavLink[]>({
    queryKey: siteContentKeys.navLinksByLocation(location || 'all'),
    queryFn: async () => {
      const params = location ? { location } : {};
      const response = await api.get<{ data: NavLink[] }>('/api/public/nav-links', { params });
      // API may return { data: [...] } or just [...] 
      return Array.isArray(response) ? response : (response as unknown).data || response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes — nav links rarely change
    gcTime: 1000 * 60 * 30,   // Keep in cache for 30 minutes
    retry: 1,
  });
};

/**
 * Fetch site settings (name, tagline, contact info, etc.) from the CMS backend.
 * Uses a 5-minute staleTime since settings almost never change.
 */
export const useSiteSettings = () => {
  return useQuery<Record<string, string>>({
    queryKey: siteContentKeys.settings(),
    queryFn: async () => {
      const response = await api.get<{ data: SiteSetting[] } | SiteSetting[]>('/api/public/settings');
      const settings = Array.isArray(response) ? response : (response as unknown).data || [];
      // Convert array of { key, value } into a flat Record<string, string>
      return (settings as SiteSetting[]).reduce((acc: Record<string, string>, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {});
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
};
