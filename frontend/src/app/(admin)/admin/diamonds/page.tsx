"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { MoreVertical, Filter, Search, Gem, Plus } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function DiamondsPage() {
  const [diamonds, setDiamonds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasPermission('manage_diamonds') && !hasPermission('Super Admin')) {
      router.push('/admin');
      return;
    }

    async function fetchDiamonds() {
      try {
        const response = await apiClient.get('/api/diamonds');
        setDiamonds(response.data.data || []); 
      } catch (error) {
        console.error('Error fetching diamonds:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiamonds();
  }, [hasPermission, router]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      <div className="h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Diamond Inventory</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage all diamonds, vendors, pricing, and availability.
          </p>
        </div>
        <div className="mt-4 flex gap-3 sm:ml-16 sm:mt-0 sm:flex-none">
          <button type="button" className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-amber-400 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Diamond
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-800 rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 border-collapse">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6">Diamond ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Shape</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Weight</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Color</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Clarity</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                  {diamonds?.map((diamond) => (
                    <tr key={diamond.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                          <Gem className="h-4 w-4 text-zinc-400" />
                          #{diamond.stock_number || diamond.id}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400 capitalize">{diamond.shape}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">{diamond.carat} ct</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">{diamond.color}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">{diamond.clarity}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-900 dark:text-white font-medium">${parseFloat(diamond.price).toLocaleString()}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                         {diamond.is_available ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">Available</span>
                         ) : (
                            <span className="inline-flex items-center rounded-full bg-zinc-50 dark:bg-zinc-500/10 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Sold</span>
                         )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-zinc-400 hover:text-zinc-500 transition-colors">
                          <MoreVertical className="h-5 w-5" />
                          <span className="sr-only">, {diamond.id}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!diamonds || diamonds.length === 0) && (
                     <tr>
                        <td colSpan={8} className="py-12 text-center">
                           <div className="flex flex-col items-center gap-2 text-zinc-500">
                             <Gem className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                             <p>No diamonds found in inventory.</p>
                           </div>
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
