"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { LayoutDashboard, Gem, Box, ShoppingCart, Users, Settings, X, LogOut } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, permission: null },
    { name: 'Diamonds', href: '/admin/diamonds', icon: Gem, permission: 'manage_diamonds' },
    { name: 'Products', href: '/admin/products', icon: Box, permission: 'manage_products' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, permission: 'manage_orders' },
    { name: 'Users & Roles', href: '/admin/users', icon: Users, permission: 'manage_users' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, permission: 'manage_settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-zinc-300 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full hidden md:flex md:w-20"
      )}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800">
          <Link href="/admin" className="flex items-center gap-2">
            <Gem className="h-6 w-6 text-amber-500" />
            {isOpen && <span className="text-xl font-bold text-white tracking-tight">RGI<span className="text-amber-500">Admin</span></span>}
          </Link>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-zinc-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-zinc-700">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              if (item.permission && !hasPermission(item.permission)) return null;

              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white border border-transparent"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <Icon className={clsx("flex-shrink-0 transition-transform group-hover:scale-110", isOpen ? "h-5 w-5" : "h-6 w-6 mx-auto", isActive ? "text-amber-400" : "")} />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={logout}
            className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className={clsx("flex-shrink-0", isOpen ? "h-5 w-5" : "h-6 w-6 mx-auto")} />
            {isOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
