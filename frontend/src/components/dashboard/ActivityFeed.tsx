import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string | number;
  title: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  title?: string;
  activities: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ title = "Recent Activity", activities, className }: ActivityFeedProps) {
  return (
    <Card className={cn("flex flex-col border-dashboard-border bg-dashboard-card", className)}>
      <CardHeader className="pb-3 border-b border-dashboard-border">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[300px] w-full p-4">
          {activities.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-dashboard-text-muted">
              No recent activity
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {index !== activities.length - 1 && (
                    <span
                      className="absolute left-[15px] top-8 h-full w-[2px] bg-dashboard-border"
                      aria-hidden="true"
                    />
                  )}
                  {/* Icon */}
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dashboard-bg border border-dashboard-border text-dashboard-accent">
                    {activity.icon ? (
                      activity.icon
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-dashboard-accent" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex flex-col pb-4">
                    <p className="text-sm font-medium text-dashboard-text">
                      {activity.title}
                    </p>
                    <p className="text-xs text-dashboard-text-muted mt-0.5">
                      {activity.description}
                    </p>
                    <span className="text-[10px] text-dashboard-text-muted mt-1 break-words">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
