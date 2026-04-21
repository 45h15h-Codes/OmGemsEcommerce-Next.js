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
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Quote {
  id: number;
  user_id: number;
  status: string;
  total_estimated_value: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: number;
  quote_id: number;
  diamond_id?: number | null;
  product_id?: number | null;
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
  sections: any[];
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
