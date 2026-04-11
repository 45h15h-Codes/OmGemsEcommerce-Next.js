"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { apiClient } from '@/lib/apiClient';
import { Users, Gem, ShoppingCart, TrendingUp } from 'lucide-react';

interface Stats {
  total_users: number;
  total_diamonds: number;
  total_orders: number;
  total_revenue: number;
}

interface Activity {
  id: number;
  description: string;
  time: string;
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await apiClient.get('/api/admin/stats');
        setStats(response.data.stats);
        setActivities(response.data.recent_activity);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Total Diamonds', value: stats?.total_diamonds || 0, icon: Gem, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Total Orders', value: stats?.total_orders || 0, icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Total Revenue', value: `$${(stats?.total_revenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>)}
      </div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-shadow">
              <dt>
                <div className={`absolute rounded-xl p-3 ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-1 sm:pb-2 gap-2">
                <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{stat.value}</p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium tracking-tight mb-4">Recent Activity</h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <ul role="list" className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {activities.map((activity) => (
              <li key={activity.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
                    {activity.time}
                  </div>
                </div>
              </li>
            ))}
            {activities.length === 0 && (
              <li className="p-8 text-center text-zinc-500">No recent activity found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
