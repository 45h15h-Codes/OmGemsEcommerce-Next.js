"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/catalogApi";
import { ProductCard } from "@/components/catalog/ProductCard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { resolveMediaUrl } from "@/lib/media";
import { FramerCarousel } from "@/components/ui/framer-carousel";

const FALLBACK_IMAGE = "/diamond.png";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const query = useQuery({
    queryKey: ["catalog-product", slug],
    queryFn: () => catalogApi.product(slug),
    retry: false,
  });

  if (query.isLoading) {
    return (
      <main className="min-h-screen bg-background px-6 pb-32 pt-36 md:px-12 lg:px-24">
        <LoadingSkeleton variant="detail" />
      </main>
    );
  }

  if (query.isError || !query.data?.data) {
    return (
      <main className="min-h-screen bg-background px-6 pb-32 pt-36 md:px-12 lg:px-24">
        <EmptyState
          title="Product not found"
          description="This piece may be unpublished or no longer available."
          variant="search"
        />
      </main>
    );
  }

  const product = query.data.data;

  // Build unified media list: product.media + diamond image_urls/video_urls
  const rawMedia: Array<{ url: string; is_primary?: boolean; alt_text?: string; type?: string }> = [];

  if (product.media?.length) {
    rawMedia.push(...product.media);
  } else if (product.primary_image) {
    rawMedia.push({ url: product.primary_image, is_primary: true });
  }

  // Inject diamond image_urls if present
  if (product.diamond?.image_urls?.length) {
    for (const url of product.diamond.image_urls) {
      if (!rawMedia.some(m => m.url === url)) {
        rawMedia.push({ url, type: "image" });
      }
    }
  }
  // Inject diamond video_urls if present
  if (product.diamond?.video_urls?.length) {
    for (const url of product.diamond.video_urls) {
      if (!rawMedia.some(m => m.url === url)) {
        rawMedia.push({ url, type: "video" });
      }
    }
  }
  // Inject diamond primary video_url if not already covered
  if (product.diamond?.video_url && !rawMedia.some(m => m.url === product.diamond.video_url)) {
    rawMedia.push({ url: product.diamond.video_url, type: "video" });
  }

  const heroImage = resolveMediaUrl(
    rawMedia.find((item) => item.is_primary)?.url ||
      rawMedia[0]?.url ||
      FALLBACK_IMAGE,
  );

  const carouselItems =
    rawMedia.length > 0
      ? rawMedia.map((item: any, index: number) => ({
          id: index,
          url: resolveMediaUrl(item.url || FALLBACK_IMAGE),
          title: item.alt_text || product.name,
          type: (item.type as "image" | "video") || undefined,
        }))
      : undefined;

  let customAttributes: [string, any][] = [];
  if (product.attributes) {
    if (Array.isArray(product.attributes)) {
      customAttributes = product.attributes
        .filter((attr: any) => attr && attr.name && attr.value)
        .map((attr: any) => [attr.name, attr.value]);
    } else if (typeof product.attributes === "object") {
      customAttributes = Object.entries(product.attributes);
    }
  }

  const specs = [
    ["SKU", product.sku],
    ["Type", product.product_type.replace("_", " ")],
    ["Availability", product.inventory_status?.replace("_", " ")],
    ...customAttributes,
    ["Carat", product.diamond?.carat],
    ["Shape", product.diamond?.shape],
    ["Color", product.diamond?.color],
    ["Clarity", product.diamond?.clarity],
    ["Cut", product.diamond?.cut],
    ["Polish", product.diamond?.polish],
    ["Symmetry", product.diamond?.symmetry],
    ["Fluorescence", product.diamond?.fluorescence],
    ["Lab", product.diamond?.lab],
    ["Certificate", product.diamond?.certificate_number],
    ["Material", product.jewelry?.material],
    ["Metal Purity", product.jewelry?.metal_purity],
    ["Gemstone", product.jewelry?.gemstone_type],
    ["Stone Count", product.jewelry?.gemstone_count],
    ["Dimensions", product.jewelry?.dimensions],
    ["Finish", product.jewelry?.finish_type],
  ].filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  return (
    <main className="min-h-screen bg-background pb-32 pt-36">
      <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:px-12 lg:grid-cols-12 lg:px-24">
        <div className="lg:col-span-7">
          <FramerCarousel items={carouselItems} />
        </div>

        <div className="flex flex-col justify-center space-y-12 lg:col-span-5">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              {product.category?.name || "Om Gems Catalog"}
            </p>
            <h1 className="font-serif text-5xl uppercase leading-[0.88] tracking-tight md:text-7xl">
              {product.name}
            </h1>
            <p className="mt-8 text-2xl font-light tracking-tight">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: product.currency || "USD",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </p>
            {product.description && (
              <p className="mt-8 max-w-xl text-sm font-light leading-relaxed tracking-widest text-muted-foreground">
                {product.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-8">
            {specs.slice(0, 12).map(([label, value]) => (
              <div key={label}>
                <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-widest">
                  {String(value)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="flex-1 bg-foreground px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-background">
              Request Private Offer
            </button>
            <button className="border border-border px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em]">
              Concierge
            </button>
          </div>

          {product.diamond?.certificate_url && (
            <Link
              href={product.diamond.certificate_url}
              className="text-[10px] font-bold uppercase tracking-[0.25em] underline"
            >
              View Lab Certificate
            </Link>
          )}
        </div>
      </section>

      {product.related_products && product.related_products.length > 0 && (
        <section className="mx-auto mt-32 max-w-[1600px] px-6 md:px-12 lg:px-24">
          <h2 className="mb-12 text-center text-[10px] font-bold uppercase tracking-[0.5em] text-primary">
            Related Pieces
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {product.related_products.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
