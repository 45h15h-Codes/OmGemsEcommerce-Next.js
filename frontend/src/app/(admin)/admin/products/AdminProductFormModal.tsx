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
import { Product } from "@/types";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { notify } from "@/lib/toast";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  base_price: z.any().transform(val => Number(val)).refine(val => val >= 0, "Price must be at least 0"),
  category_id: z.any().transform(val => (val === "" || val === null ? null : Number(val))).optional(),
  status: z.enum(["active", "draft", "archived"]),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AdminProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function AdminProductFormModal({
  isOpen,
  onClose,
  product,
}: AdminProductFormModalProps) {
  const isEditing = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      base_price: 0,
      category_id: null,
      status: "active",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        base_price: product.base_price,
        category_id: product.category_id,
        status: product.status as any,
      });
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
        base_price: 0,
        category_id: null,
        status: "active",
      });
    }
  }, [product, reset, isOpen]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: data as Partial<Product>,
        });
        notify.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync(data as Partial<Product>);
        notify.success("Product created successfully");
      }
      onClose();
    } catch (error: any) {
      notify.error(
        error.message || "An error occurred while saving the product",
      );
    }
  };

  // Helper to render category tree efficiently
  const renderCategoryOptions = (categoriesList: any[], level = 0) => {
    return categoriesList.map((cat) => (
      <React.Fragment key={cat.id}>
        <option value={cat.id}>
          {"\u00A0".repeat(level * 4)}
          {cat.name}
        </option>
        {cat.children &&
          cat.children.length > 0 &&
          renderCategoryOptions(cat.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update product details."
              : "Add a new product to the catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            label="Product Name"
            name="name"
            error={errors.name?.message}
            required
          >
            <input
              {...register("name")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. Vintage Gold Ring"
            />
          </FormField>

          <FormField
            label="URL Slug"
            name="slug"
            error={errors.slug?.message}
            required
          >
            <input
              {...register("slug")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. vintage-gold-ring"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Category"
              name="category_id"
              error={errors.category_id?.message}
            >
              <select
                {...register("category_id")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">No Category</option>
                {categories && renderCategoryOptions(categories)}
              </select>
            </FormField>

            <FormField
              label="Base Price ($)"
              name="base_price"
              error={errors.base_price?.message}
              required
            >
              <input
                type="number"
                step="0.01"
                {...register("base_price")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </FormField>
          </div>

          <FormField
            label="Status"
            name="status"
            error={errors.status?.message}
            required
          >
            <select
              {...register("status")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>

          <FormField
            label="Description"
            name="description"
            error={errors.description?.message}
          >
            <textarea
              {...register("description")}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Product description..."
            />
          </FormField>

          <DialogFooter className="mt-6 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
