<p align="center">
  <h1 align="center">✦ OM GEMS ✦</h1>
  <p align="center">
    <em>A Luxury B2B Jewellery & Diamond E-Commerce Platform</em>
  </p>
  <p align="center">
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#project-structure"><strong>Structure</strong></a> ·
    <a href="#portals"><strong>Portals</strong></a>
  </p>
</p>

<br/>

## 🌟 Overview

**Om Gems** is a premium, full-stack B2B and B2C e-commerce platform built for the high-end jewellery and diamond industry. Designed with a **"Quiet Luxury"** aesthetic, it combines cinematic web design with a sophisticated **multi-role management system**.

The platform provides dedicated workspaces for global administrators, independent vendors (Partners), institutional buyers (Wholesale), and retail customers, ensuring data isolation and specialized tools for every facet of the diamond trade.

<br/>

## ✨ Features

### 👤 Unified Portal System
- **Super Admin & Admin Dashboard** — Global control over users, inventory, and system analytics.
- **Partner (Vendor) Portal** — Self-service listing management, order tracking, and sales performance for independent jewelers.
- **Wholesale Buyer Workspace** — B2B dashboard with volume-based quote requests and credit utilization monitoring.
- **Retail Customer Account** — Personalized order history, wishlisting, and profile management.

### 🛡️ Enterprise-Grade Security
- **Triple-Layer RBAC Architecture** — Secured via Laravel Sanctum, role-based middleware, and granular permission checks.
- **Data Scoping** — Automated query scoping ensuring vendors only access their own inventory and orders.
- **Secure B2B Flow** — Institutional verification for access to wholesale pricing and wholesale-exclusive diamonds.

### 💎 Advanced Inventory Management
- **GIA-Certified Stock** — Real-time synchronization of premium diamond inventory.
- **Partner-Curated Listings** — Vendors can manage their own stones with full control over status and availability.
- **B2B Quotes & Orders** — Streamlined digital workflows for high-value transactions.

<br/>

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router & Turbopack |
| **React 19** | UI component library |
| **Zustand** | Lightweight state management for Auth & Data |
| **Tailwind CSS 4** | Minimalist modern styling |
| **Framer Motion & GSAP** | Cinematic animations & parallax effects |
| **Axios** | Secure API communication with interceptors |

### Backend
| Technology | Purpose |
|---|---|
| **Laravel 13** | PHP framework for RESTful API |
| **Laravel Sanctum** | SPA & Token-based Authentication |
| **Spatie Permission** | Granular RBAC (Roles & Permissions) governance |
| **Custom Middleware** | Tiered route protection (CheckRole, CheckPermission) |
| **MySQL / SQLite** | Relational database with Eloquent ORM |

<br/>

## 📁 Project Structure

```
e-commerce-next.js/
├── frontend/                    # Next.js 16 Application
│   ├── src/
│   │   ├── app/                 # App Router (Role-Grouped)
│   │   │   ├── (admin)/         # Admin & Super Admin workspaces
│   │   │   ├── partner/         # Vendor inventory & sales dashboards
│   │   │   ├── wholesale/       # B2B buyer portals & quote management
│   │   │   ├── account/         # Retail customer profile & orders
│   │   │   └── auth/            # Unified login & registration
│   │   ├── components/
│   │   │   ├── admin/           # Admin-specific UI components
│   │   │   ├── partner/         # Vendor listing & stat cards
│   │   │   ├── wholesale/       # B2B order & quote modules
│   │   │   └── ui/              # Global luxury UI primitives
│   │   └── lib/                 # Auth stores, API clients, RBAC utils
│
├── backend/                     # Laravel 13 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/     # Scoped API Controllers (Admin/Partner/Wholesale)
│   │   │   └── Middleware/      # RBAC & Permission validators
│   │   ├── Models/              # Eloquent models (User, Diamond, Quote, Wishlist)
│   ├── routes/
│   │   └── api.php              # Multi-tenant API route hierarchy
│
└── docs/                        # Phase-based implementation plans
```

<br/>

## 🔑 Portals & Access Control

| Role | Access Level | Primary Objectives |
|---|---|---|
| **Super Admin** | System Global | Full CRUD access, Role/Permission assignment |
| **Admin** | Operations | Global inventory management, Order oversight |
| **Partner** | Scoped Vendor | Private inventory management, Scoped sales data |
| **Wholesale** | Verified B2B | Wholesale pricing, Bulk quote requests, Credit tracking |
| **Customer** | Retail | Wishlist, Order tracking, Personal profile |

<br/>

## 📜 API Endpoints (Core)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Global system analytics | Admin+ |
| `GET` | `/api/partner/stats` | Vendor sales & inventory stats | Partner |
| `GET` | `/api/wholesale/stats` | B2B buyer spending & quote stats | Wholesale |
| `GET` | `/api/account/overview` | Retail customer overview | Authorized |
| `GET` | `/api/diamonds` | Browse global catalog | Public |
| `POST` | `/api/wholesale/quotes` | Submit bulk quote request | Wholesale |
| `POST` | `/api/account/wishlist` | Add item to personal wishlist | Authorized |

<br/>

## 🚀 Getting Started

### Backend Preparation
```bash
# Register roles & permissions
php artisan db:seed --class=RoleSeeder

# Populate system with mock diamond data
php artisan db:seed --class=MockDataSeeder
```

### Authentication Flow
The system uses **Zustand** state management and **Axios interceptors** to handle bearer tokens. On login, the backend returns the user's role and allowed permissions, which is then used by the Next.js **edge middleware** to dynamically restrict navigation.

<br/>

## 📄 License
This project is proprietary and confidential.

---
<p align="center">
  <sub>Luxury Crafted with Precision · <strong>Om Gems</strong> · 2026</sub>
</p>
