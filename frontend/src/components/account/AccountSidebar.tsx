"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import {
  LayoutDashboard,
  ShoppingCart,
  Heart,
  User as UserIcon,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Gem,
} from 'lucide-react';
import clsx from 'clsx';

interface AccountSidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function AccountSidebar({ isOpen, setIsOpen }: AccountSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const navItems = [
    { name: 'Overview', href: '/account', icon: LayoutDashboard },
    { name: 'My Orders', href: '/account/orders', icon: ShoppingCart },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'Profile', href: '/account/profile', icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out md:relative md:translate-x-0",
          "bg-gradient-to-b from-[#12090e] via-[#160b12] to-[#0e080c] text-zinc-300 shadow-2xl",
          isOpen ? "w-64 translate-x-0" : "-translate-x-full hidden md:flex md:w-[72px]"
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/[0.06]">
          <Link href="/account" className="flex items-center gap-2.5 min-w-0">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Gem className="h-4 w-4 text-white" />
            </div>
            {isOpen && (
              <span className="text-lg font-bold text-white tracking-tight truncate">
                My<span className="text-rose-400">Account</span>
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-zinc-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-white/10">
          <nav className="space-y-1 px-3">
            {isOpen && (
              <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-600">
                Navigation
              </p>
            )}
            {navItems.map((item) => {
              const isActive = item.href === '/account'
                ? pathname === '/account'
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-rose-500/10 text-rose-400 shadow-sm shadow-rose-500/5"
                      : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <Icon
                    className={clsx(
                      "flex-shrink-0 transition-all duration-200",
                      isOpen ? "h-[18px] w-[18px]" : "h-5 w-5 mx-auto",
                      isActive ? "text-rose-400" : "group-hover:text-rose-400/60"
                    )}
                  />
                  {isOpen && <span>{item.name}</span>}
                  {isOpen && isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/[0.06] p-3 space-y-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-white/[0.04] hover:text-zinc-300"
          >
            {isOpen ? (
              <>
                <ChevronLeft className="h-[18px] w-[18px]" />
                <span>Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5 mx-auto" />
            )}
          </button>

          <button
            onClick={logout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className={clsx("flex-shrink-0", isOpen ? "h-[18px] w-[18px]" : "h-5 w-5 mx-auto")} />
            {isOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
