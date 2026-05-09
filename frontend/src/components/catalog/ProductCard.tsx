"use client";

import Link from "next/link";
import Image from "next/image";
import type { CatalogProduct } from "@/types";
import { resolveMediaUrl } from "@/lib/media";

const FALLBACK_IMAGE = "/diamond.png";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const imageUrl = resolveMediaUrl(product.primary_image?.url || product.media?.find((item) => item.url)?.url || FALLBACK_IMAGE);
  const diamondLine = product.diamond
    ? [product.diamond.carat ? `${product.diamond.carat}ct` : null, product.diamond.shape, product.diamond.color, product.diamond.clarity]
        .filter(Boolean)
        .join(" | ")
    : null;
  const jewelryLine = product.jewelry
    ? [product.jewelry.metal_purity, product.jewelry.material, product.jewelry.gemstone_type].filter(Boolean).join(" | ")
    : null;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="aspect-[4/5] bg-muted mb-8 relative overflow-hidden border border-border">
        <Image
          src={imageUrl}
          alt={product.primary_image?.alt_text || product.name}
          width={800}
          height={1000}
          unoptimized={imageUrl.startsWith("http")}
          loading="eager"
          className="h-full w-full object-cover grayscale brightness-95 transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute left-5 top-5 bg-foreground px-3 py-1 text-[8px] font-bold uppercase tracking-[0.3em] text-background">
          {product.product_type.replace("_", " ")}
        </div>
        {product.inventory_status && (
          <div className="absolute bottom-5 right-5 bg-background/85 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-foreground">
            {product.inventory_status.replace("_", " ")}
          </div>
        )}
      </div>
      <div className="space-y-3 text-center">
        <h3 className="font-serif text-2xl uppercase tracking-tight transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {diamondLine || jewelryLine || product.category?.name || "Om Gems"}
        </p>
        <p className="text-sm font-medium tracking-tight">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: product.currency || "USD",
            maximumFractionDigits: 0,
          }).format(product.price)}
        </p>
      </div>
    </Link>
  );
}
