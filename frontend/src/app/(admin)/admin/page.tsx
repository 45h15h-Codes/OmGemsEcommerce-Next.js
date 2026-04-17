"use client";

import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Users, Gem, ShoppingCart, DollarSign } from "lucide-react";

const chartData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
];

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", amount: "$12,450", status: "completed" },
  { id: "ORD-002", customer: "Jane Smith", amount: "$4,200", status: "processing" },
  { id: "ORD-003", customer: "Acme Corp", amount: "$35,000", status: "pending" },
  { id: "ORD-004", customer: "Global Gems", amount: "$8,900", status: "shipped" },
];

const columns = [
  { header: "Order ID", accessorKey: "id" as const },
  { header: "Customer", accessorKey: "customer" as const },
  { header: "Amount", accessorKey: "amount" as const },
  { header: "Status", cell: (row: any) => <StatusBadge status={row.status} /> },
];

const activities = [
  { id: 1, title: "New Order", description: "John Doe placed ORD-001", timestamp: "2 hours ago", icon: <ShoppingCart className="h-4 w-4" /> },
  { id: 2, title: "Diamond Added", description: "1.5ct Round Brilliant added to inventory", timestamp: "5 hours ago", icon: <Gem className="h-4 w-4" /> },
  { id: 3, title: "New User Registration", description: "Jane Smith registered as Wholesale", timestamp: "1 day ago", icon: <Users className="h-4 w-4" /> },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-dashboard-text">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Revenue" value="$45,231.89" icon={<DollarSign className="h-4 w-4" />} trend="+20.1%" trendDirection="up" subtitle="from last month" />
        <StatsCard title="Total Orders" value="+2350" icon={<ShoppingCart className="h-4 w-4" />} trend="+180.1%" trendDirection="up" subtitle="from last month" />
        <StatsCard title="Diamonds in Stock" value="12,234" icon={<Gem className="h-4 w-4" />} trend="+19%" trendDirection="up" subtitle="from last month" />
        <StatsCard title="Active Users" value="+573" icon={<Users className="h-4 w-4" />} trend="+201" trendDirection="up" subtitle="since last hour" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ChartCard title="Revenue Overview" data={chartData} type="area" dataKey="revenue" nameKey="name" />
        </div>
        <div className="col-span-3">
          <ActivityFeed title="Recent Activity" activities={activities} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-dashboard-text">Recent Orders</h2>
        <DataTable columns={columns} data={recentOrders} />
      </div>
    </div>
  );
}
