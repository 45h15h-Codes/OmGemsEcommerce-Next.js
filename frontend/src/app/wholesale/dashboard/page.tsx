"use client";

import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { CreditCard, ShoppingCart, Target, ClipboardList, RotateCcw } from "lucide-react";
import { useWholesaleStats } from "@/hooks/useDashboard";
import { useWholesaleOrders } from "@/hooks/useOrders";
import { WholesaleStats } from "@/types";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function WholesaleDashboardPage() {
  const { data: statsData, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useWholesaleStats();
  const { data: ordersData, isLoading: ordersLoading } = useWholesaleOrders({ page: 1 });

  if (statsLoading) return <LoadingSkeleton variant="dashboard" />;

  if (statsError || !statsData) {
    return (
      <EmptyState
        title="Failed to load dashboard data"
        description="There was a problem fetching your wholesale analytics."
        icon={RotateCcw}
        action={{ label: "Try Again", onClick: () => refetchStats() }}
      />
    );
  }

  const response = statsData as WholesaleStats & { data?: WholesaleStats };
  const stats = response.data ?? response;
  const recentOrders = ordersData?.data?.slice(0, 5).map(o => ({
    id: o.order_number,
    items: o.items_count || 0,
    amount: `$${Number(o.total_amount || 0).toLocaleString()}`,
    status: o.status
  })) || [];

  const creditData = [
    { name: "Used", value: 35000 },
    { name: "Available", value: 65000 },
  ];

  const columns = [
    { header: "Order Ref", accessorKey: "id" as const },
    { header: "Items", accessorKey: "items" as const },
    { header: "Total", accessorKey: "amount" as const },
    { header: "Status", cell: (row: any) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-dashboard-text">Wholesale Portal</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Spent (YTD)" value={`$${(stats.total_purchases || 0).toLocaleString()}`} icon={<CreditCard className="h-4 w-4" />} />
        <StatsCard title="Pending Quotes" value={(stats.pending_quotes || 0).toString()} icon={<ClipboardList className="h-4 w-4" />} />
        <StatsCard title="Active Orders" value={(stats.active_orders || 0).toString()} icon={<ShoppingCart className="h-4 w-4" />} />
        <StatsCard title="Volume Tier" value="Platinum" icon={<Target className="h-4 w-4" />} subtitle="15% discount active" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-3">
          <ChartCard title="Credit Utilization" data={creditData} type="pie" dataKey="value" nameKey="name" description="$100,000 Credit Limit" />
        </div>
        <div className="col-span-4">
          <div className="h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-dashboard-text">Recent Orders</h2>
            {ordersLoading ? (
              <LoadingSkeleton variant="table" count={3} />
            ) : (
              <DataTable columns={columns} data={recentOrders} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
