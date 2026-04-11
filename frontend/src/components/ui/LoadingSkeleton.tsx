import React from 'react';
import clsx from 'clsx';

interface LoadingSkeletonProps {
  variant?: 'cards' | 'table' | 'detail' | 'dashboard';
  count?: number;
  className?: string;
}

/**
 * LoadingSkeleton — Phase 6 UI Polish
 *
 * Premium loading skeleton with shimmer animation.
 * Supports multiple layout variants for consistent loading states.
 */
export default function LoadingSkeleton({
  variant = 'cards',
  count = 4,
  className,
}: LoadingSkeletonProps) {
  if (variant === 'dashboard') {
    return (
      <div className={clsx("space-y-8 animate-pulse", className)}>
        {/* Header skeleton */}
        <div>
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-1" />
          <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800/70 rounded" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 skeleton-shimmer" />
                <div className="space-y-2">
                  <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer" />
                  <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800/70 rounded skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 overflow-hidden">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 skeleton-shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full max-w-xs bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer" />
                  <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800/70 rounded skeleton-shimmer" />
                </div>
                <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={clsx(
        "overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 animate-pulse",
        className
      )}>
        {/* Table header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/60 flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer" />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 flex gap-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 flex-1 bg-zinc-200 dark:bg-zinc-800/70 rounded skeleton-shimmer" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={clsx("space-y-6 animate-pulse", className)}>
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer" />
        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer" />
              <div className="h-4 flex-1 max-w-xs bg-zinc-200 dark:bg-zinc-800/70 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Cards variant (default)
  return (
    <div className={clsx(
      "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 skeleton-shimmer"
        />
      ))}
    </div>
  );
}
