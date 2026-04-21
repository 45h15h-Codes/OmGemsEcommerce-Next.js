"use client";

import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Users, Gem, ShoppingCart, DollarSign, RotateCcw } from "lucide-react";
import { useAdminStats } from "@/hooks/useDashboard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";

const chartData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    amount: "$12,450",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    amount: "$4,200",
    status: "processing",
  },
  {
    id: "ORD-003",
    customer: "Acme Corp",
    amount: "$35,000",
    status: "pending",
  },
  {
    id: "ORD-004",
    customer: "Global Gems",
    amount: "$8,900",
    status: "shipped",
  },
];

const columns = [
  { header: "Order ID", accessorKey: "id" as const },
  { header: "Customer", accessorKey: "customer" as const },
  { header: "Amount", accessorKey: "amount" as const },
  { header: "Status", cell: (row: any) => <StatusBadge status={row.status} /> },
];

// Remove hardcoded activities since they come from backend

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useAdminStats();

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Failed to load dashboard data"
        description="There was a problem fetching your analytics."
        icon={RotateCcw}
        action={{
          label: "Try Again",
          onClick: () => refetch(),
        }}
      />
    );
  }

  const { stats, recent_activity } = data;

  const activities = recent_activity.map((act) => ({
    id: act.id,
    title: "System Update",
    description: act.description,
    timestamp: act.time,
    icon: <Users className="h-4 w-4" />, // Map properly if backend sends icon types
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-dashboard-text">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${stats.total_revenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Orders"
          value={stats.total_orders.toString()}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Diamonds in Stock"
          value={stats.total_diamonds.toString()}
          icon={<Gem className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Users"
          value={stats.total_users.toString()}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ChartCard
            title="Revenue Overview"
            data={chartData}
            type="area"
            dataKey="revenue"
            nameKey="name"
          />
        </div>
        <div className="col-span-3">
          <ActivityFeed title="Recent Activity" activities={activities} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-dashboard-text">
          Recent Orders
        </h2>
        <DataTable columns={columns} data={recentOrders} />
      </div>
    </div>
  );
}
