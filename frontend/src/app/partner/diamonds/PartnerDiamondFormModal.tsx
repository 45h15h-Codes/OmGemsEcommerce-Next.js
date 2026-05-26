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
import { useCreatePartnerDiamond, useUpdatePartnerDiamond } from "@/hooks/useDiamonds";
import { notify } from "@/lib/toast";

const SHAPES = ["Round", "Princess", "Cushion", "Oval", "Emerald", "Pear", "Marquise", "Radiant", "Asscher", "Heart"];
const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K"];
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const LABS = ["GIA", "IGI", "AGS", "HRD"];

const diamondSchema = z.object({
  certificate_number: z.string().min(1, "Certificate number is required"),
  lab: z.string().min(1, "Lab is required"),
  shape: z.string().min(1, "Shape is required"),
  carat: z.any().transform(val => Number(val)).refine(val => val >= 0.01, "Carat must be at least 0.01"),
  color: z.string().min(1, "Color is required"),
  clarity: z.string().min(1, "Clarity is required"),
  cut: z.string().optional().nullable(),
  price: z.any().transform(val => Number(val)).refine(val => val >= 1, "Price must be at least 1"),
  is_available: z.boolean(),
});

type DiamondFormData = z.infer<typeof diamondSchema>;

interface PartnerDiamondFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  diamond?: Diamond | null;
}

export function PartnerDiamondFormModal({ isOpen, onClose, diamond }: PartnerDiamondFormModalProps) {
  const isEditing = !!diamond;
  const createDiamond = useCreatePartnerDiamond();
  const updateDiamond = useUpdatePartnerDiamond();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DiamondFormData>({
    resolver: zodResolver(diamondSchema),
    defaultValues: {
      certificate_number: "",
      lab: "GIA",
      shape: "Round",
      carat: 0,
      color: "D",
      clarity: "VS1",
      cut: "Excellent",
      price: 0,
      is_available: true,
    },
  });

  useEffect(() => {
    if (diamond) {
      reset({
        certificate_number: diamond.certificate_number || diamond.stock_number, // handling both just in case
        lab: diamond.lab || "GIA",
        shape: diamond.shape,
        carat: diamond.carat,
        color: diamond.color,
        clarity: diamond.clarity,
        cut: diamond.cut,
        price: diamond.base_price || (diamond as Diamond & { price?: number }).price || 0,
        is_available: diamond.is_available,
      });
    } else {
      reset({
        certificate_number: "",
        lab: "GIA",
        shape: "Round",
        carat: 0,
        color: "D",
        clarity: "VS1",
        cut: "Excellent",
        price: 0,
        is_available: true,
      });
    }
  }, [diamond, reset, isOpen]);

  const onSubmit = async (data: DiamondFormData) => {
    try {
      const payload: Partial<Diamond> = {
        ...data,
        stock_number: data.certificate_number,
        base_price: data.price,
      };

      if (isEditing && diamond) {
        await updateDiamond.mutateAsync({ id: diamond.id, data: payload });
        notify.success("Diamond updated successfully");
      } else {
        await createDiamond.mutateAsync(payload);
        notify.success("Diamond added successfully");
      }
      onClose();
    } catch (error: unknown) {
      notify.error(error instanceof Error ? error.message : "An error occurred while saving the diamond");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] sm:max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Diamond" : "Add New Diamond"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update stone details and pricing." : "List a new diamond in your inventory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Certificate #" name="certificate_number" error={errors.certificate_number?.message} required>
              <input
                {...register("certificate_number")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. GIA-2384756"
              />
            </FormField>
            
            <FormField label="Lab" name="lab" error={errors.lab?.message} required>
              <select
                {...register("lab")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {LABS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Shape" name="shape" error={errors.shape?.message} required>
              <select
                {...register("shape")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {SHAPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>
            
            <FormField label="Carat Weight" name="carat" error={errors.carat?.message} required>
              <input
                type="number"
                step="0.01"
                {...register("carat")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. 1.52"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Color" name="color" error={errors.color?.message} required>
              <select
                {...register("color")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>
            
            <FormField label="Clarity" name="clarity" error={errors.clarity?.message} required>
               <select
                {...register("clarity")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {CLARITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Cut" name="cut" error={errors.cut?.message}>
               <select
                {...register("cut")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </FormField>
          </div>

          <FormField label="Price (USD)" name="price" error={errors.price?.message} required>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </FormField>

          <div className="flex items-center space-x-2 pt-2 border-t mt-4 border-zinc-100 dark:border-zinc-800">
            <input
              type="checkbox"
              id="is_available"
              {...register("is_available")}
              className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
            />
            <label htmlFor="is_available" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Available for Sale
            </label>
          </div>

          <DialogFooter className="mt-6 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white">
              {isSubmitting ? "Saving..." : "Save Diamond"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
