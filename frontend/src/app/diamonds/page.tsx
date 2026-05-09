"use client";

import { CatalogListing } from "@/components/catalog/CatalogListing";

export default function DiamondsPage() {
  return (
    <CatalogListing
      mode={{ kind: "products", params: { type: "diamond", category: "diamonds" } }}
      eyebrow="Professional Diamond Terminal"
      title="Global Inventory"
      description="Certified diamonds with advanced filters for shape, carat, color, clarity, cut, polish, symmetry, fluorescence, lab, and origin."
    />
  );
}
