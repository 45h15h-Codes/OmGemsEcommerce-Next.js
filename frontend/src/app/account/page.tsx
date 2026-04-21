"use client";

import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ShoppingBag, Heart, Clock, Award, RotateCcw } from "lucide-react";
import { useAccountOverview } from "@/hooks/useDashboard";
import { useAccountOrders } from "@/hooks/useOrders";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function AccountDashboardPage() {
  const { data: statsData, isLoading: statsLoading, isError: statsError, refetch } = useAccountOverview();
  const { data: ordersData, isLoading: ordersLoading } = useAccountOrders({ page: 1 });

  if (statsLoading) return <LoadingSkeleton variant="dashboard" />;

  if (statsError || !statsData) {
    return (
      <EmptyState
        title="Failed to load dashboard data"
        description="There was a problem fetching your account overview."
        icon={RotateCcw}
        action={{ label: "Try Again", onClick: () => refetch() }}
      />
    );
  }

  const stats = statsData.data || statsData;
  const recentOrders = ordersData?.data?.slice(0, 5).map((o: any) => ({
    id: o.order_number,
    date: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    amount: `$${Number(o.total_amount || 0).toLocaleString()}`,
    status: o.status
  })) || [];

  const columns = [
    { header: "Order #", accessorKey: "id" as const },
    { header: "Date", accessorKey: "date" as const },
    { header: "Total", accessorKey: "amount" as const },
    { header: "Status", cell: (row: any) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-dashboard-text">My Account</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Orders" value={(stats.total_orders || 0).toString()} icon={<ShoppingBag className="h-4 w-4" />} />
        <StatsCard title="Wishlist Items" value={(stats.wishlist_items || 0).toString()} icon={<Heart className="h-4 w-4" />} />
        <StatsCard title="Recent Purchases" value={(stats.recent_purchases || 0).toString()} icon={<Clock className="h-4 w-4" />} />
        <StatsCard title="Rewards Points" value="1,240" icon={<Award className="h-4 w-4" />} subtitle="Gold Member" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-dashboard-text">Order History</h2>
        {ordersLoading ? (
            <LoadingSkeleton variant="table" count={3} />
        ) : (
            <DataTable columns={columns} data={recentOrders} />
        )}
      </div>
    </div>
  );
}
