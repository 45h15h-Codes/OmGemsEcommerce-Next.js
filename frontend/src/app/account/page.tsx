"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { apiClient } from '@/lib/apiClient';
import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  Package,
  DollarSign,
  ArrowUpRight,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';

interface AccountStats {
  total_orders: number;
  pending_orders: number;
  total_spent: number;
  wishlist_items: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  items_count: number;
  total: number;
  status: string;
  tracking_number: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
  processing: { label: 'Processing', icon: AlertCircle, color: 'text-blue-500 bg-blue-500/10' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-indigo-500 bg-indigo-500/10' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
};

export default function AccountOverview() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const response = await apiClient.get('/api/account/overview');
        setStats(response.data.stats);
        setRecentOrders(response.data.recent_orders);
      } catch (error) {
        console.error('Error fetching account overview:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

  const statCards = [
    {
      name: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      gradient: 'from-rose-500 to-pink-600',
      shadowColor: 'shadow-rose-500/20',
      href: '/account/orders',
    },
    {
      name: 'Pending',
      value: stats?.pending_orders || 0,
      icon: Package,
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/20',
      href: '/account/orders',
    },
    {
      name: 'Total Spent',
      value: `$${(stats?.total_spent || 0).toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-600',
      shadowColor: 'shadow-emerald-500/20',
      href: '/account/orders',
    },
    {
      name: 'Wishlist',
      value: stats?.wishlist_items || 0,
      icon: Heart,
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/20',
      href: '/account/wishlist',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-rose-500 mb-1">
          My Account
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Welcome to your account. Track orders, manage your wishlist, and more.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              href={stat.href}
              className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className={clsx(
                "absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500",
                stat.gradient
              )} />

              <div className="flex items-center gap-4 relative z-10">
                <div className={clsx(
                  "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  stat.gradient,
                  stat.shadowColor
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{stat.value}</p>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</p>
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {recentOrders.map((order) => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;
              return (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors gap-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow shadow-rose-500/20">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-zinc-900 dark:text-white">{order.order_number}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {order.items_count} item{order.items_count > 1 ? 's' : ''} •{' '}
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pl-14 sm:pl-0">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">${order.total.toLocaleString()}</span>
                    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", statusInfo.color)}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}
            {recentOrders.length === 0 && (
              <div className="p-16 text-center">
                <ShoppingCart className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">No orders yet.</p>
                <p className="text-xs text-zinc-400 mt-1">Start browsing our collection to place your first order.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
