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
import { Diamond } from "@/types";
import {
  useCreateAdminDiamond,
  useUpdateAdminDiamond,
} from "@/hooks/useDiamonds";
import { notify } from "@/lib/toast";
import { useUsers } from "@/hooks/useUsers";

const diamondSchema = z.object({
  stock_number: z.string().min(1, "Stock number is required"),
  shape: z.string().min(1, "Shape is required"),
  carat: z.any().transform(val => Number(val)).refine(val => val >= 0.01, "Carat must be at least 0.01"),
  color: z.string().min(1, "Color is required"),
  clarity: z.string().min(1, "Clarity is required"),
  base_price: z.any().transform(val => Number(val)).refine(val => val >= 1, "Price must be at least 1"),
  vendor_id: z.any().transform(val => (val === "" || val === null ? null : Number(val))).optional(),
  is_available: z.boolean(),
});

type DiamondFormData = z.infer<typeof diamondSchema>;

interface AdminDiamondFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  diamond?: Diamond | null;
}

export function AdminDiamondFormModal({
  isOpen,
  onClose,
  diamond,
}: AdminDiamondFormModalProps) {
  const isEditing = !!diamond;
  const createDiamond = useCreateAdminDiamond();
  const updateDiamond = useUpdateAdminDiamond();

  // We can fetch users (or specifically vendors) to populate the vendor dropdown
  const { data: usersData } = useUsers();
  const vendors =
    usersData?.data?.filter((u) =>
      typeof u.role === "string"
        ? u.role === "Partner"
        : u.roles?.some((r: any) => r === "Partner" || r.name === "Partner"),
    ) || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DiamondFormData>({
    resolver: zodResolver(diamondSchema),
    defaultValues: {
      stock_number: "",
      shape: "",
      carat: 0,
      color: "",
      clarity: "",
      base_price: 0,
      vendor_id: null,
      is_available: true,
    },
  });

  useEffect(() => {
    if (diamond) {
      reset({
        stock_number: diamond.stock_number,
        shape: diamond.shape,
        carat: diamond.carat,
        color: diamond.color,
        clarity: diamond.clarity,
        base_price: diamond.base_price,
        vendor_id: diamond.vendor_id,
        is_available: diamond.is_available,
      });
    } else {
      reset({
        stock_number: "",
        shape: "",
        carat: 0,
        color: "",
        clarity: "",
        base_price: 0,
        vendor_id: null,
        is_available: true,
      });
    }
  }, [diamond, reset, isOpen]);

  const onSubmit = async (data: DiamondFormData) => {
    try {
      if (isEditing && diamond) {
        await updateDiamond.mutateAsync({
          id: diamond.id,
          data: data as Partial<Diamond>,
        });
        notify.success("Diamond updated successfully");
      } else {
        await createDiamond.mutateAsync(data as Partial<Diamond>);
        notify.success("Diamond created successfully");
      }
      onClose();
    } catch (error: any) {
      notify.error(
        error.message || "An error occurred while saving the diamond",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] sm:max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Diamond" : "Add New Diamond"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update diamond details and pricing."
              : "Add a new diamond to the inventory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Stock Number"
              name="stock_number"
              error={errors.stock_number?.message}
              required
            >
              <input
                {...register("stock_number")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="DIA-001"
              />
            </FormField>

            <FormField
              label="Vendor"
              name="vendor_id"
              error={errors.vendor_id?.message}
            >
              <select
                {...register("vendor_id")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Vendor...</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Shape"
              name="shape"
              error={errors.shape?.message}
              required
            >
              <select
                {...register("shape")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Shape...</option>
                <option value="round">Round</option>
                <option value="princess">Princess</option>
                <option value="cushion">Cushion</option>
                <option value="emerald">Emerald</option>
                <option value="oval">Oval</option>
                <option value="radiant">Radiant</option>
                <option value="pear">Pear</option>
              </select>
            </FormField>

            <FormField
              label="Carat Weight"
              name="carat"
              error={errors.carat?.message}
              required
            >
              <input
                type="number"
                step="0.01"
                {...register("carat")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Color"
              name="color"
              error={errors.color?.message}
              required
            >
              <input
                {...register("color")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. D, E, F"
              />
            </FormField>

            <FormField
              label="Clarity"
              name="clarity"
              error={errors.clarity?.message}
              required
            >
              <input
                {...register("clarity")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. VVS1, VS2"
              />
            </FormField>
          </div>

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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </FormField>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="is_available"
              {...register("is_available")}
              className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
            />
            <label
              htmlFor="is_available"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              Available for Sale
            </label>
          </div>

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
              {isSubmitting ? "Saving..." : "Save Diamond"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
