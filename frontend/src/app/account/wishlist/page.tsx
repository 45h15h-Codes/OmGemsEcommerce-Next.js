"use client";

import React, { useState } from 'react';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { notify } from '@/lib/toast';
import {
  Heart,
  Trash2,
  ShoppingCart,
  Gem,
  Package,
  Search,
  RotateCcw,
} from 'lucide-react';
import clsx from 'clsx';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function AccountWishlist() {
  const [search, setSearch] = useState('');

  const { data, isLoading: loading, isError, refetch } = useWishlist();
  const removeItemMutation = useRemoveFromWishlist();

  // Simple frontend filtering as an example
  const allItems = data?.data || [];
  const items = search === '' 
    ? allItems 
    : allItems.filter((item: any) => {
        const d = item.diamond;
        const p = item.product;
        if (d) {
          const title = `${d.shape} ${d.carat}ct ${d.color}/${d.clarity}`;
          return title.toLowerCase().includes(search.toLowerCase()) || d.certificate_number?.toLowerCase().includes(search.toLowerCase());
        }
        if (p) {
          return p.name.toLowerCase().includes(search.toLowerCase());
        }
        return false;
      });

  async function removeItem(id: number) {
    try {
      await removeItemMutation.mutateAsync(id);
      notify.success("Removed from wishlist");
    } catch (error: any) {
      notify.error("Failed to remove from wishlist", error.message);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
           <LoadingSkeleton variant="shop" count={3} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
       <EmptyState
        title="Failed to load wishlist"
        description="There was a problem fetching your wishlist."
        icon={RotateCcw}
        action={{ label: "Try Again", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-rose-500 mb-1">
            Saved Items
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            My Wishlist
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {allItems.length} item{allItems.length !== 1 ? 's' : ''} saved for later.
          </p>
        </div>
        <a
          href="/diamonds"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all hover:-translate-y-0.5"
        >
          <Gem className="h-4 w-4" />
          Browse Diamonds
        </a>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your wishlist..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
        />
      </div>

      {/* Wishlist Grid */}
      {allItems.length === 0 ? (
        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-16 text-center">
          <Heart className="h-16 w-16 text-zinc-200 dark:text-zinc-700 mx-auto mb-4" />
          <p className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">Your wishlist is empty</p>
          <p className="text-sm text-zinc-400 mt-1">Browse our collection and save items you love.</p>
          <a
             href="/diamonds"
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all hover:-translate-y-0.5"
          >
            <Gem className="h-4 w-4" />
            Start Browsing
          </a>
        </div>
      ) : items.length === 0 ? (
          <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-16 text-center">
            <Search className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No matches found.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item: any) => {
            const isDiamond = item.diamond !== null && item.diamond !== undefined;
            const title = isDiamond
              ? `${item.diamond.shape} ${item.diamond.carat}ct ${item.diamond.color}/${item.diamond.clarity}`
              : item.product?.name || "Item";
            const price = isDiamond ? (item.diamond.total_price || item.diamond.base_price || 0) : (item.product?.base_price || 0);
            const isAvailable = isDiamond ? !!item.diamond.is_available : true;
            const isRemoving = removeItemMutation.variables === item.id && removeItemMutation.isPending;

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 hover:shadow-lg transition-all duration-300"
              >
                {/* Image placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                  {isDiamond ? (
                    <Gem className="h-16 w-16 text-zinc-300 dark:text-zinc-600" />
                  ) : (
                    <Package className="h-16 w-16 text-zinc-300 dark:text-zinc-600" />
                  )}

                  {/* Availability badge */}
                  {!isAvailable && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-red-500/90 text-white text-[10px] font-semibold uppercase tracking-wider">
                      Unavailable
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={isRemoving}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-rose-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-red-50 dark:hover:bg-red-500/20 disabled:opacity-50"
                  >
                    <Trash2 className={clsx("h-4 w-4", isRemoving && "animate-pulse")} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">{title}</p>
                  {isDiamond && (
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {item.diamond.certificate_number}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">
                      ${Number(price).toLocaleString()}
                    </span>
                    <button
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                        isAvailable
                          ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm hover:shadow-lg hover:shadow-rose-500/20"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                      )}
                      disabled={!isAvailable}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {isAvailable ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
