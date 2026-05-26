// ─── Centralized Order Status Configuration ──────────────────────────────────
// Single source of truth for order status labels, colors, and backgrounds.
//
// Usage:
//   import { ORDER_STATUS, type OrderStatus } from '@/lib/constants/orderStatus';
//   const config = ORDER_STATUS[order.status];
//   <span className={`${config.bg} ${config.text} px-2 py-1 rounded-full text-xs`}>
//     {config.label}
//   </span>

export const ORDER_STATUS = {
  pending: {
    label: "Pending",
    color: "yellow",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  paid: {
    label: "Paid",
    color: "green",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  processing: {
    label: "Processing",
    color: "blue",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  shipped: {
    label: "Shipped",
    color: "purple",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  delivered: {
    label: "Delivered",
    color: "green",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  refunded: {
    label: "Refunded",
    color: "gray",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;
