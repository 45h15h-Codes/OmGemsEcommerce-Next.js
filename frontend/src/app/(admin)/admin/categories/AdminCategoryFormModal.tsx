"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Category } from "@/types";
import { useCreateCategory, useUpdateCategory, useCategories } from "@/hooks/useCategories";
import { notify } from "@/lib/toast";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  parent_id: z.any().transform(val => (val === "" || val === null ? null : Number(val))).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AdminCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function AdminCategoryFormModal({ isOpen, onClose, category }: AdminCategoryFormModalProps) {
  const isEditing = !!category;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  
  const { data: allCategories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parent_id: null,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        parent_id: category.parent_id,
      });
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
        parent_id: null,
      });
    }
  }, [category, reset, isOpen]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && category) {
        if (data.parent_id === category.id) {
           notify.error("Category cannot be its own parent.");
           return;
        }
        await updateCategory.mutateAsync({ id: category.id, data: data as Partial<Category> });
        notify.success("Category updated successfully");
      } else {
        await createCategory.mutateAsync(data as Partial<Category>);
        notify.success("Category created successfully");
      }
      onClose();
    } catch (error: any) {
      notify.error(error.message || "An error occurred while saving the category");
    }
  };

  const renderCategoryOptions = (categoriesList: Category[], level = 0) => {
    return categoriesList.map((cat) => {
      // Prevent selecting a category or its children as its own parent
      const isDisabled = isEditing && category && (cat.id === category.id);
      
      return (
        <React.Fragment key={cat.id}>
          <option value={cat.id} disabled={isDisabled}>
            {"\u00A0".repeat(level * 4)}{cat.name}
          </option>
          {cat.children && cat.children.length > 0 && renderCategoryOptions(cat.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update category details." : "Add a new category to organize products."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField label="Category Name" name="name" error={errors.name?.message} required>
            <input
              {...register("name")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. Necklaces"
            />
          </FormField>
          
          <FormField label="URL Slug" name="slug" error={errors.slug?.message} required>
            <input
              {...register("slug")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. necklaces"
            />
          </FormField>
          
          <FormField label="Parent Category" name="parent_id" error={errors.parent_id?.message}>
            <select
              {...register("parent_id")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">None (Top Level)</option>
              {allCategories && renderCategoryOptions(allCategories)}
            </select>
          </FormField>
          
          <FormField label="Description" name="description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Category description..."
            />
          </FormField>

          <DialogFooter className="mt-6 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
