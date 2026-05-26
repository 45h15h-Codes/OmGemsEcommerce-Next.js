import { DashboardShell } from "@/components/dashboard/DashboardShell";
import React from "react";

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="wholesale">{children}</DashboardShell>;
}
