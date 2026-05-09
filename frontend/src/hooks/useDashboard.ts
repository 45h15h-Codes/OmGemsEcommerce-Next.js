import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import {
  AdminDashboardResponse,
  PartnerDashboardResponse,
  WholesaleStats,
  AccountOverview,
} from "@/types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  admin: () => [...dashboardKeys.all, "admin"] as const,
  partner: () => [...dashboardKeys.all, "partner"] as const,
  wholesale: () => [...dashboardKeys.all, "wholesale"] as const,
  account: () => [...dashboardKeys.all, "account"] as const,
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: dashboardKeys.admin(),
    queryFn: () =>
      api.get<AdminDashboardResponse>("/api/admin/stats"),
  });
};

export const usePartnerStats = () => {
  return useQuery({
    queryKey: dashboardKeys.partner(),
    queryFn: () => api.get<PartnerDashboardResponse>('/api/partner/stats'),
  });
};

export const useWholesaleStats = () => {
  return useQuery({
    queryKey: dashboardKeys.wholesale(),
    queryFn: () => api.get<WholesaleStats>("/api/wholesale/stats"),
  });
};

export const useAccountOverview = () => {
  return useQuery({
    queryKey: dashboardKeys.account(),
    queryFn: () => api.get<AccountOverview>("/api/account/overview"),
  });
};
