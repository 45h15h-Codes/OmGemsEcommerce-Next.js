"use client";

import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { CreditCard, ShoppingCart, Target, ClipboardList } from "lucide-react";

export default function WholesaleDashboardPage() {
  const creditData = [
    { name: "Used", value: 35000 },
    { name: "Available", value: 65000 },
  ];

  const recentOrders = [
    { id: "WS-092", items: 45, amount: "$15,200", status: "processing" },
    { id: "WS-091", items: 120, amount: "$42,500", status: "completed" },
  ];

  const columns = [
    { header: "Order Ref", accessorKey: "id" as const },
    { header: "Items", accessorKey: "items" as const },
    { header: "Total", accessorKey: "amount" as const },
    { header: "Status", cell: (row: any) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-dashboard-text">Wholesale Portal</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Spent (YTD)" value="$145,200" icon={<CreditCard className="h-4 w-4" />} trend="+12%" trendDirection="up" />
        <StatsCard title="Active Quotes" value="3" icon={<ClipboardList className="h-4 w-4" />} />
        <StatsCard title="Orders This Month" value="14" icon={<ShoppingCart className="h-4 w-4" />} />
        <StatsCard title="Volume Tier" value="Platinum" icon={<Target className="h-4 w-4" />} subtitle="15% discount active" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-3">
          <ChartCard title="Credit Utilization" data={creditData} type="pie" dataKey="value" nameKey="name" description="$100,000 Credit Limit" />
        </div>
        <div className="col-span-4">
          <div className="h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-dashboard-text">Recent Orders</h2>
            <DataTable columns={columns} data={recentOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}
