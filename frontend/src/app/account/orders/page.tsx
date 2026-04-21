"use client";

import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  RotateCcw,
} from 'lucide-react';
import clsx from 'clsx';
import { useAccountOrders } from '@/hooks/useOrders';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; barColor: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-500 bg-amber-500/10', barColor: 'bg-amber-500' },
  processing: { label: 'Processing', icon: AlertCircle, color: 'text-blue-500 bg-blue-500/10', barColor: 'bg-blue-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-indigo-500 bg-indigo-500/10', barColor: 'bg-indigo-500' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10', barColor: 'bg-emerald-500' },
};

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

export default function AccountOrders() {
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading: loading, isError, refetch } = useAccountOrders({ page, search: search === '' ? undefined : search });

  const copyTracking = (tracking: string) => {
    navigator.clipboard.writeText(tracking);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 animate-pulse" />
        <LoadingSkeleton variant="table" count={4} />
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
        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-rose-500 mb-1">
          Order History
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          My Orders
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Track your purchases and manage your order history.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order number or tracking..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
        />
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-16 text-center">
          <ShoppingCart className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">No orders yet.</p>
          <p className="text-xs text-zinc-400 mt-1">Visit our collection to place your first order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const statusInfo = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedOrder === order.id;
            const currentStep = statusSteps.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Order header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow shadow-rose-500/20">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-zinc-900 dark:text-white">{order.order_number}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pl-14 sm:pl-0">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">${Number(order.total_amount || order.total || 0).toLocaleString()}</span>
                    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", statusInfo.color)}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusInfo.label}
                    </span>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-zinc-100 dark:border-zinc-800/60 p-5 space-y-5">
                    {/* Progress bar */}
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-3">Order Progress</p>
                      <div className="flex items-center gap-1">
                        {statusSteps.map((step, i) => (
                          <React.Fragment key={step}>
                            <div className={clsx(
                              "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                              i <= currentStep
                                ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                            )}>
                              {i + 1}
                            </div>
                            {i < statusSteps.length - 1 && (
                              <div className={clsx(
                                "flex-1 h-1 rounded-full transition-all",
                                i < currentStep ? "bg-gradient-to-r from-rose-500 to-pink-500" : "bg-zinc-100 dark:bg-zinc-800"
                              )} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {statusSteps.map((step) => (
                          <span key={step} className="text-[10px] text-zinc-400 capitalize">{step}</span>
                        ))}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2">Items</p>
                      <div className="space-y-2">
                        {(order.items || []).map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl">
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                {item.diamond?.stock_number ? `Diamond #${item.diamond.stock_number}` : item.product?.name || item.name || 'Item'}
                            </span>
                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">${Number(item.price || 0).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tracking */}
                    {order.tracking_number && (
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2">Tracking</p>
                        <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl">
                          <Truck className="h-4 w-4 text-zinc-400" />
                          <span className="text-sm font-mono text-zinc-700 dark:text-zinc-300 flex-1">{order.tracking_number}</span>
                          <button
                            onClick={() => copyTracking(order.tracking_number!)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                            title="Copy tracking number"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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
