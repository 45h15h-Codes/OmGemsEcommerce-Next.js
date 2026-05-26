"use client";

import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Gem, ShoppingCart, DollarSign, PackageOpen, RotateCcw, Activity } from "lucide-react";
import { usePartnerStats } from "@/hooks/useDashboard";
import { PartnerDashboardResponse } from "@/types";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";

const chartData = [
  { name: "Mon", sales: 1200 },
  { name: "Tue", sales: 900 },
  { name: "Wed", sales: 1600 },
  { name: "Thu", sales: 1100 },
  { name: "Fri", sales: 2100 },
  { name: "Sat", sales: 3000 },
  { name: "Sun", sales: 2800 },
];

// Render recent diamonds table if provided later, hiding static mock

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const columns = [
  { header: "ID", accessorKey: "id" as const },
  { header: "Shape", accessorKey: "shape" as const },
  { header: "Carat", accessorKey: "carat" as const },
  { header: "Status", cell: (row: any) => <StatusBadge status={row.status} /> },
];

export default function PartnerDashboardPage() {
  const { data, isLoading, isError, refetch } = usePartnerStats();

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Failed to load dashboard data"
        description="There was a problem fetching your partner analytics."
        icon={RotateCcw}
        action={{
          label: "Try Again",
          onClick: () => refetch(),
        }}
      />
    );
  }

  const response = data as PartnerDashboardResponse & { data?: PartnerDashboardResponse };
  const { stats, recent_activity } = response.data ?? response;

  const activities = recent_activity?.map((act: any) => ({
    id: act.id,
    title: act.type === 'order' ? "New Order" : act.type === 'payment' ? "Payment Received" : "System Update",
    description: act.description,
    timestamp: act.time,
    icon: <Activity className="h-4 w-4" />,
  })) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-dashboard-text">Partner Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="My Earnings" value={`$${(stats?.total_revenue || 0).toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} />
        <StatsCard title="Active Listings" value={(stats?.active_diamonds || 0).toString()} icon={<PackageOpen className="h-4 w-4" />} />
        <StatsCard title="Diamonds Sold" value={(stats?.completed_orders || 0).toString()} icon={<Gem className="h-4 w-4" />} />
        <StatsCard title="Pending Orders" value={(stats?.pending_orders || 0).toString()} icon={<ShoppingCart className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ChartCard title="Weekly Sales" data={chartData} type="bar" dataKey="sales" nameKey="name" />
        </div>
        <div className="col-span-3">
          <ActivityFeed title="Recent Activity" activities={activities} />
        </div>
      </div>
    </div>
  );
}
