import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  subtitle?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendDirection,
  subtitle,
  isLoading,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="border-dashboard-border bg-dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium"><Skeleton className="h-4 w-20 skeleton-shimmer" /></CardTitle>
          <Skeleton className="h-4 w-4 rounded-full skeleton-shimmer" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"><Skeleton className="h-8 w-24 skeleton-shimmer mt-2" /></div>
          <p className="text-xs text-muted-foreground mt-2"><Skeleton className="h-3 w-32 skeleton-shimmer" /></p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow group border-dashboard-border bg-dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-dashboard-text-muted">{title}</CardTitle>
        <div className="text-dashboard-accent opacity-70 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-dashboard-text">{value}</div>
        {(trend || subtitle) && (
          <p className="text-xs text-dashboard-text-muted mt-1 flex items-center gap-1">
            {trend && trendDirection === "up" && <ArrowUpIcon className="h-3 w-3 text-green-500" />}
            {trend && trendDirection === "down" && <ArrowDownIcon className="h-3 w-3 text-red-500" />}
            {trend && (
              <span
                className={cn(
                  trendDirection === "up" && "text-green-500",
                  trendDirection === "down" && "text-red-500"
                )}
              >
                {trend}
              </span>
            )}
            {subtitle && <span className="ml-1">{subtitle}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
