"use client";

import { CatalogListing } from "@/components/catalog/CatalogListing";

export default function HighJewelryPage() {
  return (
    <CatalogListing
      mode={{ kind: "category", slug: "high-jewelry", params: { type: "high_jewelry" } }}
      eyebrow="The Atelier of Rare Creations"
      title="High Jewelry"
      description="Rare, one-of-a-kind atelier pieces surfaced dynamically from the Super Admin catalog."
    />
  );
}
