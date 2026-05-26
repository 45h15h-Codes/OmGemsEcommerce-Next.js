"use client";

import { Suspense, useMemo, useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/catalogApi";
import type { CatalogFilter, CatalogProduct, PaginatedResponse } from "@/types";
import { ProductCard } from "@/components/catalog/ProductCard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";

interface CatalogListingResponse {
  products: PaginatedResponse<CatalogProduct>;
  filters?: CatalogFilter[];
}

type ListingMode =
  | { kind: "products"; params?: Record<string, string | number | undefined> }
  | { kind: "category"; slug: string; params?: Record<string, string | number | undefined> }
  | { kind: "collection"; slug: string; params?: Record<string, string | number | undefined> };

interface CatalogListingProps {
  mode: ListingMode;
  eyebrow: string;
  title: string;
  description?: string;
  defaultFilters?: CatalogFilter[];
}

const DEFAULT_FILTERS: CatalogFilter[] = [
  { key: "search", label: "Search", type: "text" },
  { key: "price_min", label: "Min Price", type: "number" },
  { key: "price_max", label: "Max Price", type: "number" },
];

function CatalogListingInner({ mode, eyebrow, title, description, defaultFilters = DEFAULT_FILTERS }: CatalogListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | undefined> = { ...(mode.params || {}) };
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [mode, searchParams]);

  const query = useQuery({
    queryKey: ["catalog", mode, queryParams],
    queryFn: async () => {
      if (mode.kind === "category") return catalogApi.category(mode.slug, queryParams);
      if (mode.kind === "collection") return catalogApi.collection(mode.slug, queryParams);
      return catalogApi.products(queryParams);
    },
    retry: (failureCount, error) => {
      if ((error as any)?.status === 404) return false;
      return failureCount < 3;
    },
  });

  const filterQuery = useQuery({
    queryKey: ["catalog-filters", mode.kind === "category" ? mode.slug : queryParams.category],
    queryFn: async () => catalogApi.filters(mode.kind === "category" ? mode.slug : String(queryParams.category || "")),
  });

  if (query.isError && (query.error as any)?.status === 404) {
    notFound();
  }

  const payload = query.data as CatalogListingResponse | PaginatedResponse<CatalogProduct> | undefined;
  const hasProductsEnvelope = (
    value: CatalogListingResponse | PaginatedResponse<CatalogProduct> | undefined,
  ): value is CatalogListingResponse & { products: PaginatedResponse<CatalogProduct> } => {
    return Boolean(value && "products" in value && value.products);
  };
  const hasFilters = (
    value: CatalogListingResponse | PaginatedResponse<CatalogProduct> | undefined,
  ): value is CatalogListingResponse => {
    return Boolean(value && "filters" in value);
  };
  const paginated = hasProductsEnvelope(payload) ? payload.products : (payload as PaginatedResponse<CatalogProduct> | undefined);
  const products: CatalogProduct[] = paginated?.data || [];
  const total = paginated?.total || products.length;
  const filters: CatalogFilter[] =
    (hasFilters(payload) ? payload.filters : undefined) ||
    filterQuery.data?.data?.filters ||
    filterQuery.data?.filters ||
    defaultFilters;

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`?${next.toString()}`, { scroll: false });
  };

  const filterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em]">Refine</h2>
        <button
          type="button"
          onClick={() => router.push("?", { scroll: false })}
          className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          Reset
        </button>
      </div>
      {filters.map((filter: CatalogFilter) => (
        <label key={filter.key} className="block space-y-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{filter.label}</span>
          {filter.type === "select" ? (
            <select
              value={searchParams.get(filter.key) || ""}
              onChange={(event) => updateParam(filter.key, event.target.value)}
              className="w-full border border-border bg-background px-3 py-3 text-[10px] uppercase tracking-widest outline-none focus:border-foreground"
            >
              <option value="">All</option>
              {filter.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={filter.type}
              value={searchParams.get(filter.key) || ""}
              onChange={(event) => updateParam(filter.key, event.target.value)}
              className="w-full border border-border bg-background px-3 py-3 text-[10px] uppercase tracking-widest outline-none focus:border-foreground"
            />
          )}
        </label>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-background pb-32 pt-36">
      <section className="mx-auto mb-16 max-w-[1600px] border-b border-border px-6 pb-12 md:px-12 lg:px-24">
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">{eyebrow}</p>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-serif text-5xl uppercase leading-[0.9] tracking-tight md:text-8xl">{title}</h1>
            {description && <p className="mt-8 max-w-xl text-sm font-light leading-relaxed tracking-widest text-muted-foreground">{description}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            <span>{total} pieces</span>
            <button className="lg:hidden" onClick={() => setMobileFiltersOpen((open) => !open)}>
              Filters
            </button>
            <select
              value={searchParams.get("sort") || "featured"}
              onChange={(event) => updateParam("sort", event.target.value)}
              className="border border-border bg-background px-3 py-3 text-foreground outline-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price Low</option>
              <option value="price_desc">Price High</option>
              <option value="carat_desc">Carat High</option>
              <option value="carat_asc">Carat Low</option>
            </select>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && <section className="mx-6 mb-10 border border-border p-6 lg:hidden">{filterPanel}</section>}

      <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:px-12 lg:grid-cols-12 lg:px-24">
        <aside className="hidden h-fit border-r border-border pr-8 lg:sticky lg:top-32 lg:col-span-3 lg:block">
          {filterPanel}
        </aside>
        <div className="lg:col-span-9">
          {query.isLoading && <LoadingSkeleton variant="cards" count={8} className="lg:grid-cols-3" />}
          {query.isError && (
            <EmptyState title="Catalog unavailable" description="The product feed could not be loaded. Please try again." variant="search" />
          )}
          {!query.isLoading && !query.isError && products.length === 0 && (
            <EmptyState title="No pieces found" description="Adjust filters or search terms to explore more of the catalog." variant="search" />
          )}
          {products.length > 0 && (
            <div className="grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export function CatalogListing(props: CatalogListingProps) {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background pb-32 pt-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
          <LoadingSkeleton variant="cards" count={8} />
        </div>
      </main>
    }>
      <CatalogListingInner {...props} />
    </Suspense>
  );
}
