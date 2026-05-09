"use client";

import React, { useState } from "react";
import {
  Gem,
  Plus,
  Search,
  Filter,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import clsx from "clsx";
import { usePartnerDiamonds, useDeletePartnerDiamond, useTogglePartnerDiamond } from "@/hooks/useDiamonds";
import { Diamond } from "@/types";
import { PartnerDiamondFormModal } from "./PartnerDiamondFormModal";
import { notify } from "@/lib/toast";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function PartnerDiamondsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [editingDiamond, setEditingDiamond] = useState<Diamond | null>(null);

  const { data, isLoading, isError, refetch } = usePartnerDiamonds({ page, search: searchQuery });
  const deleteDiamond = useDeletePartnerDiamond();
  const toggleDiamond = useTogglePartnerDiamond();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  const openEditForm = (diamond: Diamond) => {
    setEditingDiamond(diamond);
    setShowForm(true);
  };

  const handleToggle = async (id: number) => {
    try {
      // Optismtic update happens at React Query mutation config or we can just invalidate
      await toggleDiamond.mutateAsync(id);
      notify.success("Diamond availability updated");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      notify.error("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this diamond?")) return;
    try {
      await deleteDiamond.mutateAsync(id);
      notify.success("Diamond deleted");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      notify.error("Failed to delete diamond");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-10 w-36 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <LoadingSkeleton variant="table" count={10} />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load diamonds"
        description="There was a problem fetching your inventory."
        icon={RotateCcw}
        action={{ label: "Try Again", onClick: () => refetch() }}
      />
    );
  }

  const diamonds = data?.data || [];
  const meta = data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-teal-500 mb-1">
            Inventory Management
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            My Diamonds
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {meta?.total || 0} stones in your inventory
          </p>
        </div>
        <button
          onClick={() => {
            setEditingDiamond(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Add Diamond
        </button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by certificate, shape, color, clarity..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setSearchQuery("");
            setPage(1);
          }}
          className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
        >
          <Filter className="h-4 w-4" /> Clear Filter
        </button>
      </form>

      {/* Diamond Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50">
        {diamonds.length === 0 ? (
          <div className="p-16 text-center">
            <Gem className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              No diamonds yet
            </h3>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">
              Add your first diamond to get started.
            </p>
            <button
              onClick={() => {
                setEditingDiamond(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-medium rounded-lg"
            >
              <Plus className="h-4 w-4" /> Add Diamond
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/60">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Certificate</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Shape</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Carat</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Color</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Clarity</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Cut</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Price</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
                {diamonds.map((diamond: Diamond) => (
                  <tr
                    key={diamond.id}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/20 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                          <Gem className="h-3.5 w-3.5 text-teal-500" />
                        </div>
                        <div>
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            {diamond.certificate_number || diamond.stock_number}
                          </span>
                          <p className="text-[10px] text-zinc-400">
                            {diamond.lab || 'GIA'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 capitalize">
                      {diamond.shape}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                      {diamond.carat} ct
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {diamond.color}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {diamond.clarity}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {diamond.cut || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                      ${parseFloat(diamond.base_price as unknown).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(diamond.id)}
                        disabled={toggleDiamond.isPending && toggleDiamond.variables === diamond.id}
                        className="flex items-center gap-1.5"
                      >
                        {diamond.is_available ? (
                          <ToggleRight className="h-5 w-5 text-teal-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-zinc-400" />
                        )}
                        <span
                          className={clsx(
                            "text-[10px] font-semibold uppercase tracking-wider",
                            diamond.is_available
                              ? "text-teal-500"
                              : "text-zinc-400",
                          )}
                        >
                          {diamond.is_available ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditForm(diamond)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-teal-500 hover:bg-teal-500/10 transition-all"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(diamond.id)}
                          disabled={deleteDiamond.isPending && deleteDiamond.variables === diamond.id}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-zinc-500">
            Page {page} of {meta.last_page} ({meta.total} stones)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= meta.last_page}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <PartnerDiamondFormModal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        diamond={editingDiamond} 
      />
    </div>
  );
}
