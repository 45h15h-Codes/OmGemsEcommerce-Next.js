import { DashboardShell } from "@/components/dashboard/DashboardShell";
import React from "react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="retail">{children}</DashboardShell>;
}
