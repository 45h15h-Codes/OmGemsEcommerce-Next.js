export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roles: { name: string }[] | string[];
  permissions: { name: string }[] | string[];
  redirect_path?: string;
}

export interface Diamond {
  id: number;
  stock_number: string;
  vendor_id?: number | null;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string | null;
  polish?: string | null;
  symmetry?: string | null;
  fluorescence?: string | null;
  lab?: string | null;
  certificate_number?: string | null;
  base_price: number;
  total_price: number;
  is_available: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  vendor?: User;
}

export interface Product {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CatalogMedia {
  id?: number;
  type?: string;
  role?: string | null;
  is_primary?: boolean;
  sort_order?: number;
  url?: string | null;
  alt_text?: string | null;
}

export interface DiamondProfile {
  carat?: number | string | null;
  cut?: string | null;
  color?: string | null;
  clarity?: string | null;
  shape?: string | null;
  lab?: string | null;
  certificate_number?: string | null;
  certificate_url?: string | null;
  fluorescence?: string | null;
  polish?: string | null;
  symmetry?: string | null;
  measurements?: string | null;
  origin?: string | null;
  stone_type?: string | null;
  depth_percent?: number | string | null;
  table_percent?: number | string | null;
  culet?: string | null;
  video_url?: string | null;
  view_360_url?: string | null;
  image_urls?: string[];
  video_urls?: string[];
}

export interface JewelryProfile {
  material?: string | null;
  metal_purity?: string | null;
  gemstone_type?: string | null;
  gemstone_count?: number | null;
  total_carat_weight?: number | string | null;
  ring_size?: string | null;
  style?: string | null;
  dimensions?: string | null;
  finish_type?: string | null;
  is_handmade?: boolean;
  is_customizable?: boolean;
  luxury_tags?: string[] | null;
}

export interface CatalogProduct {
  id: number;
  sku: string;
  name: string;
  slug: string;
  product_type: 'diamond' | 'jewelry' | 'high_jewelry' | 'custom';
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  currency: string;
  inventory_status?: string;
  stock_quantity?: number;
  featured?: boolean;
  brand?: string | null;
  collection_name?: string | null;
  gender?: string | null;
  occasion?: string | null;
  primary_image?: CatalogMedia | null;
  media?: CatalogMedia[];
  category?: Category | null;
  categories?: Category[];
  collections?: CatalogCollection[];
  diamond?: DiamondProfile | null;
  jewelry?: JewelryProfile | null;
  tags?: string[];
  attributes?: Record<string, unknown>;
  seo?: {
    title?: string;
    description?: string;
    canonical_url?: string | null;
  };
  breadcrumbs?: { label: string; href: string }[];
  related_products?: CatalogProduct[];
}

export interface CatalogCollection {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  type?: string;
  is_featured?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface CatalogFilter {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

export interface Category {
  id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  description?: string;
  children?: Category[];
  parent?: Category;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  status: string;
  items_count?: number;
  tracking_number?: string | null;
  items?: any[];
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Quote {
  id: number;
  user_id: number;
  status: string;
  total_estimated_value: number;
  total_estimate?: number;
  notes?: string | null;
  admin_notes?: string | null;
  items: QuoteItem[];
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: number;
  quote_id: number;
  diamond_id?: number | null;
  product_id?: number | null;
  quantity: number;
  name?: string;
  price?: number;
  shape?: string;
  carat_min?: number;
  carat_max?: number;
  color_range?: string;
  clarity_range?: string;
  color?: string;
  clarity?: string;
  diamond?: Diamond;
  product?: Product;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  diamond_id?: number | null;
  product_id?: number | null;
  diamond?: Diamond;
  product?: Product;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface Activity {
  id: number;
  description: string;
  time: string;
}

export interface AdminDashboardResponse {
  stats: {
    total_users: number;
    total_diamonds: number;
    total_orders: number;
    total_revenue: number;
  };
  recent_activity: Activity[];
}

export interface PartnerDashboardResponse {
  stats: {
    total_diamonds: number;
    active_diamonds: number;
    inactive_diamonds: number;
    inventory_value: number;
    pending_orders: number;
    completed_orders: number;
    total_revenue: number;
  };
  recent_activity: {
    id: number;
    description: string;
    time: string;
    type: string;
  }[];
}

export interface WholesaleStats {
  total_purchases: number;
  pending_quotes: number;
  active_orders: number;
}

export interface AccountOverview {
  total_orders: number;
  wishlist_items: number;
  recent_purchases: number;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

// ─── CMS Types ──────────────────────────────────────────────

export interface NavLink {
  id: number;
  label: string;
  url: string;
  location: 'header' | 'footer';
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
  children?: NavLink[];
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
}

export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  sections: unknown[];
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
