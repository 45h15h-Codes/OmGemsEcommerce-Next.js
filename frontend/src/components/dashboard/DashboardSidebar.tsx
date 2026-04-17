"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigationConfig, Role } from "./navigation.config";
import { Diamond } from "lucide-react";

interface DashboardSidebarProps {
  role: Role;
  collapsed?: boolean;
}

export function DashboardSidebar({ role, collapsed = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = navigationConfig[role] || [];

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-dashboard-border bg-dashboard-sidebar text-white transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center px-4 md:px-6 border-b border-white/10">
        <Diamond className="h-6 w-6 text-dashboard-accent shrink-0" />
        {!collapsed && (
          <div className="ml-3 flex flex-col overflow-hidden">
            <span className="font-serif text-lg font-semibold whitespace-nowrap">OmGems</span>
            <span className="text-xs text-dashbg-muted capitalize text-gray-400">
              {role.replace("_", " ")} Portal
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto mt-4 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mb-1",
                isActive
                  ? "bg-dashboard-accent/10 text-dashboard-accent"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
                collapsed ? "justify-center" : "justify-start"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
