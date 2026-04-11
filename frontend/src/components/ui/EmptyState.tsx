import React from "react";
import {
  Inbox,
  Search,
  FileX,
  ShoppingCart,
  Heart,
  Gem,
  Package,
} from "lucide-react";
import clsx from "clsx";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "diamonds" | "orders" | "wishlist" | "search";
  className?: string;
}

const variantConfig = {
  default: {
    icon: Inbox,
    gradient: "from-zinc-400 to-zinc-500",
    shadow: "shadow-zinc-400/20",
  },
  diamonds: {
    icon: Gem,
    gradient: "from-amber-400 to-amber-600",
    shadow: "shadow-amber-400/20",
  },
  orders: {
    icon: Package,
    gradient: "from-blue-400 to-blue-600",
    shadow: "shadow-blue-400/20",
  },
  wishlist: {
    icon: Heart,
    gradient: "from-rose-400 to-rose-600",
    shadow: "shadow-rose-400/20",
  },
  search: {
    icon: Search,
    gradient: "from-violet-400 to-violet-600",
    shadow: "shadow-violet-400/20",
  },
};

/**
 * EmptyState — Phase 6 UI Polish
 *
 * Reusable empty state component with variant-based theming,
 * gradient icon containers, and optional action buttons.
 * Used across all portals for consistent zero-state messaging.
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = icon || config.icon;

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-16 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
        className,
      )}
    >
      <div className="relative mb-6">
        <div
          className={clsx(
            "absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse bg-gradient-to-br",
            config.gradient,
          )}
        />
        <div
          className={clsx(
            "relative h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl",
            config.gradient,
            config.shadow,
          )}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className={clsx(
            "mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r",
            config.gradient,
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
