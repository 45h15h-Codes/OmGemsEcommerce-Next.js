"use client";

import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Gem, ShoppingCart, DollarSign, PackageOpen } from "lucide-react";

const chartData = [
  { name: "Mon", sales: 1200 },
  { name: "Tue", sales: 900 },
  { name: "Wed", sales: 1600 },
  { name: "Thu", sales: 1100 },
  { name: "Fri", sales: 2100 },
  { name: "Sat", sales: 3000 },
  { name: "Sun", sales: 2800 },
];

const myDiamonds = [
  { id: "D-101", shape: "Round", carat: "1.05", status: "active" },
  { id: "D-102", shape: "Princess", carat: "2.10", status: "pending" },
  { id: "D-103", shape: "Oval", carat: "1.50", status: "sold" },
];

const columns = [
  { header: "ID", accessorKey: "id" as const },
  { header: "Shape", accessorKey: "shape" as const },
  { header: "Carat", accessorKey: "carat" as const },
  { header: "Status", cell: (row: any) => <StatusBadge status={row.status} /> },
];

export default function PartnerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-dashboard-text">Partner Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="My Earnings" value="$12,450.00" icon={<DollarSign className="h-4 w-4" />} trend="+15%" trendDirection="up" />
        <StatsCard title="Active Listings" value="45" icon={<PackageOpen className="h-4 w-4" />} />
        <StatsCard title="Diamonds Sold" value="12" icon={<Gem className="h-4 w-4" />} trend="+2" trendDirection="up" />
        <StatsCard title="Pending Orders" value="3" icon={<ShoppingCart className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ChartCard title="Weekly Sales" data={chartData} type="bar" dataKey="sales" nameKey="name" />
        </div>
        <div className="col-span-3">
          <div className="bg-dashboard-card border border-dashboard-border rounded-xl p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-dashboard-text">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-dashboard-bg hover:bg-dashboard-accent/10 border border-dashboard-border rounded-lg transition-colors text-dashboard-text font-medium text-sm">
                + Add New Diamond
              </button>
              <button className="w-full text-left px-4 py-3 bg-dashboard-bg hover:bg-dashboard-accent/10 border border-dashboard-border rounded-lg transition-colors text-dashboard-text font-medium text-sm">
                View Inventory Report
              </button>
              <button className="w-full text-left px-4 py-3 bg-dashboard-bg hover:bg-dashboard-accent/10 border border-dashboard-border rounded-lg transition-colors text-dashboard-text font-medium text-sm">
                Update Pricing
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-dashboard-text">My Recent Diamonds</h2>
        <DataTable columns={columns} data={myDiamonds} />
      </div>
    </div>
  );
}
