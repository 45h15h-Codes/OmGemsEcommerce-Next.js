"use client";

import React, { useState, useEffect } from "react";
import AccountSidebar from "./AccountSidebar";
import AccountTopbar from "./AccountTopbar";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

/**
 * AccountShell — Phase 6 Hardened
 *
 * Wraps all retail account pages with error boundary, branded loading,
 * and consistent rose/pink theme.
 */
export default function AccountShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0e] gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-2xl shadow-rose-500/30">
            <Heart className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="text-sm font-medium text-zinc-400 tracking-wide">
          Loading your account...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#0a0a0e] overflow-hidden text-zinc-900 dark:text-zinc-100">
      <AccountSidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <AccountTopbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
