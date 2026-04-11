"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { apiClient } from '@/lib/apiClient';
import { Gem, ShoppingCart, TrendingUp, Package, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import clsx from 'clsx';

interface PartnerStats {
  total_diamonds: number;
  active_diamonds: number;
  inactive_diamonds: number;
  inventory_value: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
}

interface Activity {
  id: number;
  description: string;
  time: string;
  type: string;
}

export default function PartnerDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await apiClient.get('/api/partner/stats');
        setStats(response.data.stats);
        setActivities(response.data.recent_activity);
      } catch (error) {
        console.error('Error fetching partner stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Active Listings',
      value: stats?.active_diamonds || 0,
      subtitle: `${stats?.inactive_diamonds || 0} inactive`,
      icon: Gem,
      gradient: 'from-teal-500 to-emerald-600',
      shadowColor: 'shadow-teal-500/20',
      trend: '+12%',
      trendUp: true,
    },
    {
      name: 'Pending Orders',
      value: stats?.pending_orders || 0,
      subtitle: `${stats?.completed_orders || 0} completed`,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-500/20',
      trend: '+3',
      trendUp: true,
    },
    {
      name: 'Revenue',
      value: `$${(stats?.total_revenue || 0).toLocaleString()}`,
      subtitle: 'This month',
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/20',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      name: 'Inventory Value',
      value: `$${(stats?.inventory_value || 0).toLocaleString()}`,
      subtitle: `${stats?.total_diamonds || 0} total stones`,
      icon: Package,
      gradient: 'from-purple-500 to-violet-600',
      shadowColor: 'shadow-purple-500/20',
      trend: '-2.1%',
      trendUp: false,
    },
  ];

  const activityTypeIcons: Record<string, string> = {
    update: '✏️',
    order: '📦',
    status: '🔄',
    payment: '💰',
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-teal-500 mb-1">
            Partner Portal
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Here&apos;s an overview of your inventory and sales performance.
          </p>
        </div>
        <a
          href="/partner/diamonds"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all hover:-translate-y-0.5"
        >
          <Gem className="h-4 w-4" />
          Manage Diamonds
        </a>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Background glow on hover */}
              <div className={clsx(
                "absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500",
                stat.gradient
              )} />

              <div className="flex items-start justify-between relative z-10">
                <div className={clsx(
                  "h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  stat.gradient,
                  stat.shadowColor
                )}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className={clsx(
                  "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                  stat.trendUp
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                    : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10"
                )}>
                  {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.trend}
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{stat.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{stat.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
            Recent Activity
          </h2>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Last 7 days
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50">
          <ul role="list" className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <span className="text-lg flex-shrink-0">
                  {activityTypeIcons[activity.type] || '📋'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="flex-shrink-0 text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                  {activity.time}
                </span>
              </li>
            ))}
            {activities.length === 0 && (
              <li className="p-10 text-center text-zinc-400">
                No recent activity found.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
