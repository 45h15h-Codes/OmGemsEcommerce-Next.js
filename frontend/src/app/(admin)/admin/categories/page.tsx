"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  FolderTree,
  Folder,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { Category } from "@/types";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { AdminCategoryFormModal } from "./AdminCategoryFormModal";
import { notify } from "@/lib/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { hasPermission } = useAuthStore();
  const router = useRouter();

  const { data: categories, isLoading, isError, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();

  if (!hasPermission("manage_categories") && !hasPermission("Super Admin")) {
    if (typeof window !== "undefined") router.push("/admin");
    return null;
  }

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this category? All its subcategories will be unparented or deleted depending on your database constraints.",
      )
    ) {
      try {
        await deleteCategory.mutateAsync(id);
        notify.success("Category deleted successfully.");
      } catch (err: any) {
        notify.error("Failed to delete category", err.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-10 w-36 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load categories"
        description="There was a problem fetching the category tree."
        icon={RotateCcw}
        action={{ label: "Try Again", onClick: () => refetch() }}
      />
    );
  }

  const renderCategoryRow = (category: Category, level = 0) => (
    <React.Fragment key={category.id}>
      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
          <div
            className="flex items-center"
            style={{ paddingLeft: `${level * 2}rem` }}
          >
            {level === 0 ? (
              <FolderTree className="h-5 w-5 text-zinc-400 mr-2" />
            ) : (
              <Folder className="h-4 w-4 text-zinc-300 dark:text-zinc-600 mr-2 ml-2" />
            )}
            <div className="flex flex-col">
              <span className="font-medium text-zinc-900 dark:text-white">
                {category.name}
              </span>
              <span className="text-xs text-zinc-500 font-normal">
                /{category.slug}
              </span>
            </div>
          </div>
        </td>
        <td className="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
          <span className="truncate block">
            {category.description || (
              <span className="italic text-zinc-400">No description</span>
            )}
          </span>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
          {category.children ? category.children.length : 0} subcategories
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
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                <Edit2 className="h-4 w-4 mr-2" /> Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(category.id)}
                className="text-red-500 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      {category.children?.map((child) => renderCategoryRow(child, level + 1))}
    </React.Fragment>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Categories
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage the categorical hierarchy for your products.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            onClick={handleCreate}
            className="bg-amber-500 hover:bg-amber-400 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
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
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Status
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
                  {categories?.map((cat: Category) =>
                    renderCategoryRow(cat, 0),
                  )}
                  {(!categories || categories.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                          <FolderTree className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                          <p>No categories found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AdminCategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
