import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <Skeleton className="h-4 w-1/3 skeleton-shimmer" />
              <Skeleton className="h-4 w-4 rounded-full skeleton-shimmer" />
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-8 w-1/2 skeleton-shimmer" />
              <Skeleton className="h-3 w-1/4 skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm">
          <Skeleton className="h-[300px] w-full skeleton-shimmer" />
        </div>
        <div className="col-span-3 rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm">
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3 skeleton-shimmer" />
            <Skeleton className="h-12 w-full skeleton-shimmer" />
            <Skeleton className="h-12 w-full skeleton-shimmer" />
            <Skeleton className="h-12 w-full skeleton-shimmer" />
            <Skeleton className="h-12 w-full skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
