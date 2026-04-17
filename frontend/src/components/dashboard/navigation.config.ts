import {
  LayoutDashboard,
  Gem,
  Package,
  ShoppingCart,
  Users,
  Settings,
  AppWindow,
  ClipboardList,
  Heart,
  User,
} from "lucide-react";

export type Role = "admin" | "super_admin" | "partner" | "wholesale" | "retail";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export const navigationConfig: Record<Role, NavItem[]> = {
  super_admin: [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Diamonds", href: "/admin/diamonds", icon: Gem },
    { title: "Products", href: "/admin/products", icon: Package },
    { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Settings", href: "/admin/settings", icon: Settings },
    { title: "Page Builder", href: "/admin/builder", icon: AppWindow },
  ],
  admin: [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Diamonds", href: "/admin/diamonds", icon: Gem },
    { title: "Products", href: "/admin/products", icon: Package },
    { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  ],
  partner: [
    { title: "Dashboard", href: "/partner/dashboard", icon: LayoutDashboard },
    { title: "My Diamonds", href: "/partner/diamonds", icon: Gem },
    { title: "My Orders", href: "/partner/orders", icon: ShoppingCart },
    { title: "Profile", href: "/partner/profile", icon: User },
  ],
  wholesale: [
    { title: "Dashboard", href: "/wholesale/dashboard", icon: LayoutDashboard },
    { title: "Orders", href: "/wholesale/orders", icon: ShoppingCart },
    { title: "Bulk Quote", href: "/wholesale/quotes", icon: ClipboardList },
    { title: "Profile", href: "/wholesale/profile", icon: User },
  ],
  retail: [
    { title: "Dashboard", href: "/account", icon: LayoutDashboard },
    { title: "Orders", href: "/account/orders", icon: ShoppingCart },
    { title: "Wishlist", href: "/account/wishlist", icon: Heart },
    { title: "Profile", href: "/account/profile", icon: User },
  ],
};
