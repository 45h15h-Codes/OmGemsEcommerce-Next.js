"use client";

import { useParams } from "next/navigation";
import { CatalogListing } from "@/components/catalog/CatalogListing";

export default function JewelryCategoryPage() {
  const params = useParams<{ category: string }>();
  const slug = params.category;
  const title = slug.replace(/-/g, " ");

  return (
    <CatalogListing
      mode={{ kind: "category", slug }}
      eyebrow="The Collection Matrix"
      title={title}
      description="Curated jewelry from the live catalog, with filters and routing driven by Laravel."
    />
  );
}
