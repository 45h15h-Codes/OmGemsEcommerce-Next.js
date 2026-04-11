"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import {
  ShoppingCart, Package, Truck, CheckCircle2, Clock,
  Eye, ChevronRight, AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  items_count: number;
  total: number;
  status: string;
  created_at: string;
}

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await apiClient.get('/api/partner/orders');
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const viewOrderDetail = async (orderId: number) => {
    setLoadingDetail(true);
    try {
      const response = await apiClient.get(`/api/partner/orders/${orderId}`);
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

  // Summary stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped' || o.status === 'delivered').length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{orders.length}</p>
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
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Revenue</p>
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
            {orders.map((order) => {
              const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
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
                      {order.customer_name} · {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        ${order.total.toLocaleString()}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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

            <div className="p-6 space-y-5">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <span className="h-6 w-6 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Customer</p>
                      <p className="text-zinc-900 dark:text-white font-medium">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Status</p>
                      <p className="text-zinc-900 dark:text-white font-medium capitalize">{selectedOrder.status}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Total</p>
                      <p className="text-zinc-900 dark:text-white font-medium">${selectedOrder.total?.toLocaleString()}</p>
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
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">{item.certificate_number}</p>
                                <p className="text-[10px] text-zinc-400">{item.shape} · {item.carat} ct</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                              ${item.price?.toLocaleString()}
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
