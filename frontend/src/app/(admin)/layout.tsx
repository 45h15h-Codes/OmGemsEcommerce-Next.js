import { DashboardShell } from "@/components/dashboard/DashboardShell";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="admin" userName="Admin">{children}</DashboardShell>;
}
