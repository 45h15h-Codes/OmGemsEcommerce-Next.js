import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "neutral" | "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  
  let variantClass = "bg-gray-100 text-gray-800 border-gray-200"; // default neutral

  if (["success", "delivered", "completed", "active"].includes(normalizedStatus)) {
    variantClass = "bg-green-100 text-green-800 border-green-200";
  } else if (["warning", "pending", "processing"].includes(normalizedStatus)) {
    variantClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
  } else if (["error", "cancelled", "refunded", "failed"].includes(normalizedStatus)) {
    variantClass = "bg-red-100 text-red-800 border-red-200";
  } else if (["info", "shipped"].includes(normalizedStatus)) {
    variantClass = "bg-blue-100 text-blue-800 border-blue-200";
  }

  return (
    <Badge variant="outline" className={cn("capitalize font-medium text-[11px] px-2 py-0.5", variantClass, className)}>
      {status}
    </Badge>
  );
}
