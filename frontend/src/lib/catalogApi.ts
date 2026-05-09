import { api } from "@/lib/apiClient";
import type {
  CatalogCollection,
  CatalogFilter,
  CatalogProduct,
  Category,
  PaginatedResponse,
} from "@/types";

export interface CatalogListingResponse {
  data?: CatalogProduct[];
  products?: PaginatedResponse<CatalogProduct>;
  category?: Category;
  collection?: CatalogCollection;
  filters?: CatalogFilter[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}

export const catalogApi = {
  products: (params: Record<string, string | number | undefined> = {}) =>
    api.get<PaginatedResponse<CatalogProduct>>("/api/catalog/products", { params }),

  category: (slug: string, params: Record<string, string | number | undefined> = {}) =>
    api.get<CatalogListingResponse>(`/api/catalog/categories/${slug}`, { params }),

  collection: (slug: string, params: Record<string, string | number | undefined> = {}) =>
    api.get<CatalogListingResponse>(`/api/catalog/collections/${slug}`, { params }),

  product: (slug: string) => api.get<{ data: CatalogProduct }>(`/api/catalog/products/${slug}`),

  filters: (category?: string) =>
    api.get<{ data?: { filters: CatalogFilter[] }; filters?: CatalogFilter[] }>("/api/catalog/filters", {
      params: { category },
    }),

  categories: () => api.get<{ data: Category[] }>("/api/catalog/categories"),
};
