"use client";

import React, { useState } from 'react';
import {
  ShoppingCart, Package, Truck, CheckCircle2, Clock,
  ChevronRight, AlertCircle, RotateCcw
} from 'lucide-react';
import clsx from 'clsx';
import { usePartnerOrders } from '@/hooks/useOrders';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Order } from '@/types';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { api } from '@/lib/apiClient';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  processing: {
    label: 'Processing',
    icon: Package,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  cancelled: {
    label: 'Cancelled',
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10',
  },
};

export default function PartnerOrdersPage() {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { data, isLoading, isError, refetch } = usePartnerOrders({ page });

  const viewOrderDetail = async (orderId: number) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/api/partner/orders/${orderId}`) as { data: any };
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl animate-pulse" />)}
        </div>
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

  // Summary stats calculations
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);
  const pendingCount = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-teal-500 mb-1">
          Order Management
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          My Orders
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Orders containing your diamonds from buyers across the platform.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{meta?.total || 0}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{pendingCount}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">In Progress</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Page Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50">
        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingCart className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-1">No orders yet</h3>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Orders containing your diamonds will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
            {orders.map((order: any) => {
              const statusConf = STATUS_CONFIG[order.status?.toLowerCase()] || STATUS_CONFIG.pending;
              const StatusIcon = statusConf.icon;

              return (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/20 transition-colors group cursor-pointer"
                  onClick={() => viewOrderDetail(order.id)}
                >
                  {/* Order icon */}
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Package className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                  </div>

                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                        {order.order_number}
                      </span>
                      <span className={clsx(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                        statusConf.color, statusConf.bg
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConf.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {order.user?.name || "Customer"} · {order.items_count || 1} item{order.items_count !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        ${Number(order.total_amount || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-zinc-400">{formatDate(order.created_at)}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-teal-500 transition-colors" />
                  </div>
                </div>
              );
            })}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Order {selectedOrder.order_number}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-sm"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <span className="h-6 w-6 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Customer</p>
                      <p className="text-zinc-900 dark:text-white font-medium">{selectedOrder.user?.name || "Customer"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Status</p>
                      <p className="text-zinc-900 dark:text-white font-medium capitalize">{selectedOrder.status}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Total</p>
                      <p className="text-zinc-900 dark:text-white font-medium">${Number(selectedOrder.total_amount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Date</p>
                      <p className="text-zinc-900 dark:text-white font-medium">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                  </div>

                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-3">Items</p>
                      <div className="space-y-2">
                        {selectedOrder.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                                <Package className="h-4 w-4 text-teal-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                  {item.diamond?.stock_number || item.product?.name || "Item"}
                                </p>
                                <p className="text-[10px] text-zinc-400">
                                  {item.diamond ? `${item.diamond.shape} · ${item.diamond.carat} ct` : "Product"}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                              ${Number(item.price || 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedOrder.tracking_number && (
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
                      <p className="text-[10px] uppercase tracking-wider text-teal-600 dark:text-teal-400 font-semibold mb-1">Tracking Number</p>
                      <p className="text-sm font-medium text-teal-700 dark:text-teal-300">{selectedOrder.tracking_number}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
