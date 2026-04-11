"use client";

import React, { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";
import {
  Gem,
  Plus,
  Search,
  Filter,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import clsx from "clsx";

interface Diamond {
  id: number;
  certificate_number: string;
  lab: string;
  carat: string;
  color: string;
  clarity: string;
  cut: string | null;
  shape: string;
  price: string;
  is_available: boolean;
  created_at: string;
}

interface PaginatedResponse {
  data: Diamond[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const SHAPES = [
  "Round",
  "Princess",
  "Cushion",
  "Oval",
  "Emerald",
  "Pear",
  "Marquise",
  "Radiant",
  "Asscher",
  "Heart",
];
const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K"];
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const LABS = ["GIA", "IGI", "AGS", "HRD"];

export default function PartnerDiamondsPage() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDiamond, setEditingDiamond] = useState<Diamond | null>(null);
  const [formData, setFormData] = useState({
    certificate_number: "",
    lab: "GIA",
    carat: "",
    color: "D",
    clarity: "VS1",
    cut: "Excellent",
    shape: "Round",
    price: "",
    is_available: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchDiamonds = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = { page };
        if (search) params.search = search;
        const response = await apiClient.get("/api/partner/diamonds", {
          params,
        });
        const data: PaginatedResponse = response.data;
        setDiamonds(data.data);
        setPagination({
          current_page: data.current_page,
          last_page: data.last_page,
          total: data.total,
        });
      } catch (error) {
        console.error("Error fetching diamonds:", error);
      } finally {
        setLoading(false);
      }
    },
    [search],
  );

  useEffect(() => {
    fetchDiamonds();
  }, [fetchDiamonds]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDiamonds(1);
  };

  const resetForm = () => {
    setFormData({
      certificate_number: "",
      lab: "GIA",
      carat: "",
      color: "D",
      clarity: "VS1",
      cut: "Excellent",
      shape: "Round",
      price: "",
      is_available: true,
    });
    setEditingDiamond(null);
    setShowForm(false);
  };

  const openEditForm = (diamond: Diamond) => {
    setEditingDiamond(diamond);
    setFormData({
      certificate_number: diamond.certificate_number,
      lab: diamond.lab,
      carat: diamond.carat,
      color: diamond.color,
      clarity: diamond.clarity,
      cut: diamond.cut || "Excellent",
      shape: diamond.shape,
      price: diamond.price,
      is_available: diamond.is_available,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingDiamond) {
        await apiClient.put(
          `/api/partner/diamonds/${editingDiamond.id}`,
          formData,
        );
      } else {
        await apiClient.post("/api/partner/diamonds", formData);
      }
      resetForm();
      fetchDiamonds(pagination.current_page);
    } catch (error: any) {
      console.error("Error saving diamond:", error);
      alert(error?.response?.data?.message || "Failed to save diamond.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    setTogglingId(id);
    try {
      await apiClient.patch(`/api/partner/diamonds/${id}/toggle`);
      setDiamonds((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, is_available: !d.is_available } : d,
        ),
      );
    } catch (error) {
      console.error("Error toggling diamond:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this diamond?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/api/partner/diamonds/${id}`);
      fetchDiamonds(pagination.current_page);
    } catch (error) {
      console.error("Error deleting diamond:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
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
            {pagination.total} stones in your inventory
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
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
          type="submit"
          className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
        >
          <Filter className="h-4 w-4" /> Filter
        </button>
      </form>

      {/* Diamond Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {editingDiamond ? "Edit Diamond" : "Add New Diamond"}
              </h3>
              <button
                onClick={resetForm}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Certificate Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Certificate #
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.certificate_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificate_number: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                    placeholder="e.g. GIA-2384756"
                  />
                </div>

                {/* Lab */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Lab
                  </label>
                  <select
                    value={formData.lab}
                    onChange={(e) =>
                      setFormData({ ...formData, lab: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all appearance-none"
                  >
                    {LABS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shape */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Shape
                  </label>
                  <select
                    value={formData.shape}
                    onChange={(e) =>
                      setFormData({ ...formData, shape: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all appearance-none"
                  >
                    {SHAPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Carat */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Carat
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.carat}
                    onChange={(e) =>
                      setFormData({ ...formData, carat: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                    placeholder="e.g. 1.52"
                  />
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all appearance-none"
                  >
                    {COLORS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clarity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Clarity
                  </label>
                  <select
                    value={formData.clarity}
                    onChange={(e) =>
                      setFormData({ ...formData, clarity: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all appearance-none"
                  >
                    {CLARITIES.map((cl) => (
                      <option key={cl} value={cl}>
                        {cl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cut */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Cut
                  </label>
                  <select
                    value={formData.cut}
                    onChange={(e) =>
                      setFormData({ ...formData, cut: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all appearance-none"
                  >
                    {["Excellent", "Very Good", "Good", "Fair", "Poor"].map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                    placeholder="e.g. 12500.00"
                  />
                </div>
              </div>

              {/* Available toggle */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      is_available: !formData.is_available,
                    })
                  }
                  className={clsx(
                    "relative h-6 w-11 rounded-full transition-colors",
                    formData.is_available
                      ? "bg-teal-500"
                      : "bg-zinc-300 dark:bg-zinc-700",
                  )}
                >
                  <span
                    className={clsx(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      formData.is_available
                        ? "translate-x-5"
                        : "translate-x-0.5",
                    )}
                  />
                </button>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formData.is_available
                    ? "Available for sale"
                    : "Not available"}
                </span>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {editingDiamond ? "Save Changes" : "Add Diamond"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diamond Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-12" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded flex-1" />
              </div>
            ))}
          </div>
        ) : diamonds.length === 0 ? (
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
                resetForm();
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
                  {[
                    "Certificate",
                    "Shape",
                    "Carat",
                    "Color",
                    "Clarity",
                    "Cut",
                    "Price",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
                {diamonds.map((diamond) => (
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
                            {diamond.certificate_number}
                          </span>
                          <p className="text-[10px] text-zinc-400">
                            {diamond.lab}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
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
                      ${parseFloat(diamond.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(diamond.id)}
                        disabled={togglingId === diamond.id}
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
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditForm(diamond)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-teal-500 hover:bg-teal-500/10 transition-all"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(diamond.id)}
                          disabled={deletingId === diamond.id}
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
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-zinc-500">
            Page {pagination.current_page} of {pagination.last_page} (
            {pagination.total} stones)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDiamonds(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => fetchDiamonds(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
