"use client";

import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ShoppingBag, Heart, Clock, Award } from "lucide-react";

export default function AccountDashboardPage() {
  const recentOrders = [
    { id: "RET-104", date: "Oct 24, 2024", amount: "$4,500", status: "shipped" },
    { id: "RET-103", date: "Sep 12, 2024", amount: "$1,200", status: "completed" },
  ];

  const columns = [
    { header: "Order #", accessorKey: "id" as const },
    { header: "Date", accessorKey: "date" as const },
    { header: "Total", accessorKey: "amount" as const },
    { header: "Status", cell: (row: any) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-dashboard-text">My Account</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Orders" value="12" icon={<ShoppingBag className="h-4 w-4" />} />
        <StatsCard title="Wishlist Items" value="5" icon={<Heart className="h-4 w-4" />} />
        <StatsCard title="Pending Deliveries" value="1" icon={<Clock className="h-4 w-4" />} />
        <StatsCard title="Rewards Points" value="1,240" icon={<Award className="h-4 w-4" />} subtitle="Gold Member" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-dashboard-text">Order History</h2>
        <DataTable columns={columns} data={recentOrders} />
      </div>
    </div>
  );
}
