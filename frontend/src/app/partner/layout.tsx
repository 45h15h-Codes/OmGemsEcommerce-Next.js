import { DashboardShell } from "@/components/dashboard/DashboardShell";
import React from "react";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="partner" userName="Partner">{children}</DashboardShell>;
}
