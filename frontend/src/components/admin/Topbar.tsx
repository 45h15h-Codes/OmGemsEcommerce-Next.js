"use client";
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import { Menu, Search, Bell, User as UserIcon } from 'lucide-react';

export default function Topbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-zinc-700 dark:text-zinc-300 md:hidden hover:text-amber-500 transition-colors" onClick={toggleSidebar}>
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1 items-center" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-field" className="sr-only">Search</label>
          <Search className="pointer-events-none absolute left-0 h-5 w-5 text-zinc-400" aria-hidden="true" />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-0 sm:text-sm"
            placeholder="Search resources, diamonds, orders..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-zinc-400 hover:text-amber-500 transition-colors relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950"></span>
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative flex items-center gap-x-3 cursor-pointer group">
             <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-white shadow-sm ring-2 ring-transparent group-hover:ring-amber-500/30 transition-all">
                <UserIcon className="h-5 w-5" />
             </div>
             <span className="hidden lg:flex lg:flex-col lg:items-start">
                <span className="text-sm font-semibold leading-5 text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {user?.role || 'Guest'}
                </span>
             </span>
          </div>
        </div>
      </div>
    </header>
  );
}
