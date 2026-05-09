"use client";

import { useParams } from "next/navigation";
import { CatalogListing } from "@/components/catalog/CatalogListing";

export default function CollectionPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const title = slug.replace(/-/g, " ");

  return (
    <CatalogListing
      mode={{ kind: "collection", slug }}
      eyebrow="Curated Collection"
      title={title}
      description="Manual and smart merchandising collections powered by the Super Admin catalog."
    />
  );
}
