"use client";

import React, { useState } from "react";
import { Role } from "./navigation.config";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { useAuthStore } from "@/lib/auth";

interface DashboardShellProps {
  children: React.ReactNode;
  role: Role;
  userName?: string;
}

export function DashboardShell({ children, role, userName = "User" }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authUser = useAuthStore((state) => state.user);

  // Use real name from auth store, fall back to prop while loading
  const displayName = authUser?.name ?? userName;

  return (
    <div className="flex min-h-screen w-full bg-[#f5f4f0] relative text-[#1c1c1c]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop and Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar role={role} />
      </div>

      <div className="flex flex-1 flex-col w-full md:w-auto overflow-hidden">
        <DashboardTopbar
          role={role}
          userName={displayName}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto w-full max-w-7xl animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

