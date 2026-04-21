"use client";

import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { useWholesaleOrders } from '@/hooks/useOrders';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
  processing: { label: 'Processing', icon: AlertCircle, color: 'text-blue-500 bg-blue-500/10' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-indigo-500 bg-indigo-500/10' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
};

const paymentStatusConfig: Record<string, string> = {
  paid: 'text-emerald-500 bg-emerald-500/10',
  pending: 'text-amber-500 bg-amber-500/10',
  invoiced: 'text-blue-500 bg-blue-500/10',
  overdue: 'text-red-500 bg-red-500/10',
};

export default function WholesaleOrders() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  // We could debounce search if needed, pass search text if backend supports it
  const { data, isLoading, isError, refetch } = useWholesaleOrders({ 
    page, 
    status: filterStatus === 'all' ? undefined : filterStatus,
    search: search === '' ? undefined : search 
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 animate-pulse" />
        <div className="h-12 bg-zinc-200 dark:bg-zinc-800/50 rounded-xl animate-pulse" />
        <LoadingSkeleton variant="table" count={5} />
      </div>
    );
  }

  if (isError) {
    return (
       <EmptyState
        title="Failed to load orders"
        description="There was a problem fetching your order history."
        icon={RotateCcw}
        action={{ label: "Try Again", onClick: () => refetch() }}
      />
    );
  }

  const orders = data?.data || [];
  const meta = data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-blue-500 mb-1">
          Order Management
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          My Orders
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Track your wholesale orders, invoices, and payment status.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => { setFilterStatus(status); setPage(1); }}
              className={clsx(
                "px-4 py-2.5 rounded-xl text-xs font-medium transition-all capitalize",
                filterStatus === status
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800/60">
                <th className="text-left px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Items</th>
                <th className="text-left px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Payment</th>
                <th className="text-left px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {orders.map((order: any) => {
                const statusInfo = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-zinc-900 dark:text-white">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      {order.items_count} stones
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-zinc-900 dark:text-white">${Number(order.total_amount || order.total || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-600 dark:text-zinc-300 text-xs">{order.payment_method || 'Invoice'}</span>
                        <span className={clsx("inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide", paymentStatusConfig[order.payment_status] || paymentStatusConfig.pending)}>
                          {order.payment_status || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", statusInfo.color)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all" title="Re-order">
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-16 text-center">
            <ShoppingCart className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No orders found.</p>
            <p className="text-xs text-zinc-400 mt-1">Try adjusting your filters or place a new order.</p>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {meta.last_page}
          </span>
          <button 
            disabled={page === meta.last_page}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
