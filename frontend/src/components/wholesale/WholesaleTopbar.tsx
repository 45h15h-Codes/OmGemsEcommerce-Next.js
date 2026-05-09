"use client";

import React from 'react';
import { useAuthStore } from '@/lib/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Menu, Bell, Search, User as UserIcon, Briefcase } from 'lucide-react';

export default function WholesaleTopbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 dark:border-zinc-800/60 bg-white/80 dark:bg-[#0d1224]/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu toggle */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-zinc-500 dark:text-zinc-400 md:hidden hover:text-blue-500 transition-colors"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <form className="relative flex flex-1 items-center" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="wholesale-search-field" className="sr-only">Search</label>
          <Search className="pointer-events-none absolute left-0 h-5 w-5 text-zinc-400" aria-hidden="true" />
          <input
            id="wholesale-search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-0 sm:text-sm"
            placeholder="Search orders, quotes, inventory..."
            type="search"
            name="search"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notification bell */}
          <button type="button" className="-m-2.5 p-2.5 text-zinc-400 hover:text-blue-500 transition-colors relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-[#0d1224]" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800" aria-hidden="true" />

          {/* Profile */}
          <div className="relative flex items-center gap-x-3 cursor-pointer group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white shadow-sm ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all">
              <Briefcase className="h-4.5 w-4.5" />
            </div>
            <span className="hidden lg:flex lg:flex-col lg:items-start">
              <span className="text-sm font-semibold leading-5 text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                {user?.name || 'Buyer'}
              </span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Wholesale Buyer
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
