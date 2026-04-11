"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { apiClient } from '@/lib/apiClient';
import {
  ShoppingCart,
  FileText,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Package,
  DollarSign,
} from 'lucide-react';
import clsx from 'clsx';

interface WholesaleStats {
  total_orders: number;
  pending_orders: number;
  total_spent: number;
  total_quotes: number;
  pending_quotes: number;
  credit_limit: number;
  credit_used: number;
}

interface Activity {
  id: number;
  description: string;
  time: string;
  type: string;
}

export default function WholesaleDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<WholesaleStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await apiClient.get('/api/wholesale/stats');
        setStats(response.data.stats);
        setActivities(response.data.recent_activity);
      } catch (error) {
        console.error('Error fetching wholesale stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const creditPercentage = stats ? Math.round((stats.credit_used / stats.credit_limit) * 100) : 0;

  const statCards = [
    {
      name: 'Total Orders',
      value: stats?.total_orders || 0,
      subtitle: `${stats?.pending_orders || 0} pending`,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-500/20',
      trend: '+4',
      trendUp: true,
    },
    {
      name: 'Total Spent',
      value: `$${(stats?.total_spent || 0).toLocaleString()}`,
      subtitle: 'Lifetime',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-600',
      shadowColor: 'shadow-emerald-500/20',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      name: 'Active Quotes',
      value: stats?.pending_quotes || 0,
      subtitle: `${stats?.total_quotes || 0} total quotes`,
      icon: FileText,
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/20',
      trend: '+2',
      trendUp: true,
    },
    {
      name: 'Credit Used',
      value: `${creditPercentage}%`,
      subtitle: `$${(stats?.credit_used || 0).toLocaleString()} / $${(stats?.credit_limit || 0).toLocaleString()}`,
      icon: CreditCard,
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/20',
      trend: `${creditPercentage}%`,
      trendUp: creditPercentage < 80,
    },
  ];

  const activityTypeIcons: Record<string, string> = {
    order: '📦',
    quote: '📝',
    shipping: '🚚',
    invoice: '💳',
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
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-blue-500 mb-1">
            Wholesale Portal
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Your B2B dashboard for orders, quotes, and account management.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="/wholesale/quote"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
          >
            <FileText className="h-4 w-4" />
            Request Quote
          </a>
          <a
            href="/wholesale/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
          >
            <Package className="h-4 w-4" />
            View Orders
          </a>
        </div>
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

      {/* Credit Limit Bar */}
      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Credit Utilization</h2>
          <span className={clsx(
            "text-xs font-semibold px-2.5 py-1 rounded-full",
            creditPercentage < 50 ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" :
            creditPercentage < 80 ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10" :
            "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10"
          )}>
            {creditPercentage}% used
          </span>
        </div>
        <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-700 ease-out",
              creditPercentage < 50 ? "bg-gradient-to-r from-emerald-400 to-green-500" :
              creditPercentage < 80 ? "bg-gradient-to-r from-amber-400 to-orange-500" :
              "bg-gradient-to-r from-red-400 to-rose-500"
            )}
            style={{ width: `${creditPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-400">
          <span>${(stats?.credit_used || 0).toLocaleString()} used</span>
          <span>${(stats?.credit_limit || 0).toLocaleString()} limit</span>
        </div>
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
