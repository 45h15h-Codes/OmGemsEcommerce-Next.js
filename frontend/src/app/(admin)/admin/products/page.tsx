"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  Filter,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Package,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAdminProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Product } from "@/types";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { AdminProductFormModal } from "./AdminProductFormModal";
import { notify } from "@/lib/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { hasPermission } = useAuthStore();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useAdminProducts({ page });
  const deleteProduct = useDeleteProduct();

  if (!hasPermission("manage_products") && !hasPermission("Super Admin")) {
    if (typeof window !== "undefined") router.push("/admin");
    return null;
  }

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync(id);
        notify.success("Product deleted successfully.");
      } catch (err: any) {
        notify.error("Failed to delete product", err.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-10 w-36 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
        <LoadingSkeleton variant="table" count={10} />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load products"
        description="There was a problem fetching the product catalog."
        icon={RotateCcw}
        action={{ label: "Try Again", onClick: () => refetch() }}
      />
    );
  }

  const products = data?.data || [];
  const meta = data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Products Catalog
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage all products, pricing, and availability.
          </p>
        </div>
        <div className="mt-4 flex gap-3 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <Button
            onClick={handleCreate}
            className="bg-amber-500 hover:bg-amber-400 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 border-collapse">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Added Date
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                  {products.map((product: Product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                          <Package className="h-4 w-4 text-zinc-400" />
                          <div className="flex flex-col">
                            <span>{product.name}</span>
                            <span className="text-xs text-zinc-500 font-normal">
                              {product.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {product.category?.name || (
                          <span className="italic">Uncategorized</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-900 dark:text-white font-medium">
                        $
                        {parseFloat(product.base_price as any).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            product.status === "active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : product.status === "draft"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                : "bg-zinc-50 text-zinc-600 dark:bg-zinc-500/10 dark:text-zinc-400"
                          }`}
                        >
                          {product.status.charAt(0).toUpperCase() +
                            product.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(product)}
                            >
                              <Edit2 className="h-4 w-4 mr-2" /> Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                          <Package className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                          <p>No products found in catalog.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between mt-6 px-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {meta.last_page}
                </span>
                <Button
                  variant="outline"
                  disabled={page === meta.last_page}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
