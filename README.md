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
- **Super Admin & Admin Dashboard** — Global control over users, inventory, and system analytics. The Filament Super Admin panel is served from `/super-admin` (Backend) and is accessible directly via the **Account** link in the frontend header.
- **Partner (Vendor) Portal** — Self-service listing management, order tracking, and sales performance for independent jewelers. Login available at `/auth/login`.
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
The system uses **Zustand** state management and **Axios interceptors** to handle bearer tokens. On login, the backend returns the user's role and allowed permissions, which is then used by the Next.js **proxy** (`proxy.ts`) to dynamically restrict navigation.

<br/>

## 🧭 Evaluation Execution Status

Current evaluation execution for cloud-agent delegation:

- ✅ **Phase 0 complete**: Scope lock for storefront, admin, backend flow, checks/reporting strategy.
- ✅ **Phase 1 complete**: Baseline discovery and initial risk mapping done.
- ✅ **Phase 2 complete**: Parallel deep audits for storefront, admin operations, backend integrity, and launch readiness compiled into `compliance_audit_report.md`.
- ▶️ **Phase 3 in progress**: Planning deployment setup to Hostinger/GoDaddy servers and resolving high-priority compliance gaps.

Execution artifacts:
- `docs/cloud_agent_execution_runbook.md`
- `docs/evaluation_phase0_phase1_report.md`
- `docs/hostinger_godaddy_deployment_plan.md`

Baseline quality signals:
- Backend tests: passing (`php artisan test`)
- Frontend lint: failing baseline with outstanding type/lint debt (`npm run lint`)

<br/>

## Catalog Integration Phase

Completed implementation slice for the Super Admin to storefront product flow:

- Added an additive unified catalog schema around `products`, with product type, publish status, visibility, inventory, SEO, tags, smart/manual placement, category pivots, collection pivots, relational product media, `diamond_profiles`, and `jewelry_profiles`.
- Added `collections` for manual and smart merchandising groups such as featured luxury, diamond jewelry, engagement, and high jewelry.
- Added `ProductPlacementService` so published products can be automatically attached to storefront categories and collections while allowing `manual_placement` overrides.
- Added public catalog APIs under `/api/catalog/*` for products, product detail by slug, categories, collections, filters, search, and homepage sections.
- Added API resources for product cards, product details, categories, collections, filter schema, and media.
- Upgraded Filament product/category forms for product type, status, visibility, SEO, pricing, inventory, tags, featured placement, and primary category selection.
- Added a Filament Collections resource so `/super-admin` can manage curated storefront collections.
- Seeded default taxonomy for Diamonds, High Jewelry, Rings, Earrings, Necklaces, Bracelets, Engagement Rings, and default smart collections.
- Replaced hardcoded storefront catalog pages with API-driven routes for `/diamonds`, `/jewelry/[category]`, `/high-jewelry`, `/collections/[slug]`, and `/product/[slug]`.
- Added legacy redirects from `/diamonds/[id]` and `/jewelry/product/platinum-radiance`.
- Added `testsprite.config.json` as the first TestSprite validation configuration.

### Diamond Catalog Sync Fix

- Added `DiamondCatalogSyncService` so legacy Diamond records created from the Super Admin/Partner diamond module are mirrored into the unified storefront catalog.
- Saving a `Diamond` now creates or updates the matching `Product` and `DiamondProfile`, including price, stock state, certificate number, lab, carat, color, clarity, cut, shape, video URL, image path, and the Diamonds category placement.
- Deleting a legacy `Diamond` now removes the mirrored catalog product so deleted stones do not remain visible on `/diamonds`.
- Added `php artisan diamonds:sync-catalog` to backfill existing legacy diamonds into storefront catalog products.
- Replaced free-text Super Admin diamond inputs for lab, color, clarity, cut, and shape with dropdowns so values stay aligned with storefront filters and typos like `MARQUISH` cannot be entered through the admin form.
- Added multi-image uploads for Super Admin diamond records via `image_urls`; synced diamond catalog products now expose all uploaded image paths to storefront listing and product detail pages.
- Fixed storefront image rendering for Laravel `/storage/...` upload paths by resolving them against `NEXT_PUBLIC_API_URL` before passing them to Next image components.

Verification:
- Backend: `php artisan test` passes with 58 tests.
- New frontend catalog files lint clean when checked directly.
- Full frontend lint still fails on pre-existing portal `any` type debt outside the catalog files.
- `next build` is currently blocked by locked `.next` files held by active Node processes in the local environment.

### UI Enhancements
- Added an interactive `FramerCarousel` component to replace static image grids on product detail pages (`/product/[slug]`). Uses Framer Motion for smooth animations and Lucide React icons for controls.

### ☁️ Cloudinary Media Integration

Complete overhaul of media upload and delivery for the Super Admin panel (Filament) and the storefront carousel:

**Backend:**
- Installed `cloudinary/cloudinary_php` v3 SDK.
- Created `App\Services\CloudinaryService` — reusable service for uploading images and videos to Cloudinary with automatic `resource_type` detection from MIME type (image vs video). Supports single and bulk uploads, plus deletion by public_id.
- Added Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_URL`) to `.env` and `config/services.php`.
- Created `App\Filament\Concerns\HandleCloudinaryUploads` trait — intercepts `mutateFormDataBeforeCreate` / `mutateFormDataBeforeSave` on Filament pages, pushes temporary uploads to Cloudinary, writes resulting URLs back into model fields, and cleans up temp files. Reusable across all resource pages.
- **Diamond Admin form** (`DiamondForm.php`): Added separate `FileUpload` fields for images (JPEG/PNG/WEBP/GIF) and videos (MP4/WEBM/MOV/AVI/MKV). Videos are now fully supported — no more "file type not supported" validation errors. Uploaded files are stored on Cloudinary; `image_urls`, `image_url`, `video_url`, and `video_urls` fields are populated automatically on save.
- **Product Admin form** (`ProductForm.php`): Added Cloudinary image and video upload section; files are merged into the `media` JSON array with `{url, type, is_primary}` object structure.
- `CreateDiamond` / `EditDiamond` / `CreateProduct` / `EditProduct` pages now use `HandleCloudinaryUploads`.
- `DiamondCatalogSyncService.media()` now syncs both images and videos from Diamond → Product `media` array, outputting proper `{url, type, is_primary, alt_text}` objects instead of plain strings.
- `ProductDetailResource.media()` updated to handle both legacy string-array format and new object-array format gracefully.
- `Diamond` model: added `video_urls` (JSON, castable array) to `$fillable` and `$casts`.
- **Migration cleanup**: `video_urls` and `image_urls` folded directly into `2026_04_07_075041_create_diamonds_table.php`; the two stale add-column migration files were deleted. Schema is clean for `migrate:fresh --seed`.
- **Bug Fix**: Cloudinary Service now uses `resource_type => 'auto'` instead of defaulting to `image` for string file paths, preventing video upload failures. Frontend carousel data mapping (`rawMedia`) was also updated to prevent duplicate video rendering.

**Frontend:**
- `FramerCarousel` completely rebuilt with video support:
  - Auto-detects `image` vs `video` items by URL extension and Cloudinary path pattern (`/video/upload/`), or via an explicit `type` field.
  - Video items render a native `<video controls>` player in the main slide area.
  - **Thumbnail strip** added below the main slide — clicking any thumbnail (image or video) jumps to that slide. Video thumbnails show a play icon overlay.
  - All existing navigation (prev/next arrows, dot indicators, spring animation) preserved.
- Product detail page (`/product/[slug]`): unified media list now merges `product.media`, `diamond.image_urls`, `diamond.video_urls`, and `diamond.video_url` into a single carousel item array with correct `type` metadata.
- `resolveMediaUrl()` in `media.ts` continues to handle Cloudinary HTTPS URLs (passed through as-is) alongside legacy local `/storage/` paths.


### 📊 Graphify Knowledge Graph
- Integrated **Graphify** globally for project-wide knowledge mapping.
- Maps code, documentation, images, and schemas into an interactive knowledge graph.
- Generates `graphify-out/` with:
    - `graph.html`: Interactive browser visualization.
    - `GRAPH_REPORT.md`: Architecture audit and AI-suggested questions.
    - `graph.json`: Raw graph data for AI-agent navigation.
- Configured as an **MCP Server** for Antigravity/Gemini to enable autonomous codebase navigation.

<br/>

<br/>

### 🔐 Week 1 — Auth Hardening & Schema Migrations

Complete security overhaul of the authentication model and schema expansion for production readiness.

#### Auth Hardening

- **Task 2a — Token Expiry**: Sanctum token lifetime set to **15 minutes** (`config/sanctum.php`) to limit the blast radius of a stolen token.
- **Task 2b — Token Refresh**: Added `POST /api/token/refresh` endpoint. Invalidates the current Sanctum token and issues a new one — delivered via HttpOnly cookie. Prevents replay attacks on long-lived sessions.
- **Task 2c — HttpOnly Cookie Auth**: The Sanctum token is now stored in a server-set **HttpOnly cookie** (`auth_token`). The token is **no longer returned in the JSON response body**, eliminating the XSS attack surface of JavaScript-readable tokens. Frontend (`apiClient.ts`, `auth.ts`) updated to remove all manual Bearer token injection and localStorage token storage.
- **Task 2d — Password Reset Flow**: Added `POST /api/forgot-password` and `POST /api/reset-password` using Laravel's built-in password broker. Tokens are generated server-side and the reset link points to the Next.js frontend (`/auth/reset-password`). Registered a custom `ResetPassword::createUrlUsing()` resolver in `AppServiceProvider` to decouple from the non-existent `password.reset` named route.

#### Schema Migrations (modified existing migrations — use `migrate:fresh --seed`)

- **Task 3a — Soft Deletes on Products**: Added `deleted_at` column to `products` table and `SoftDeletes` trait to `Product` model. Products are now never hard-deleted.
- **Task 3b — Product Variants**: Created `product_variants` table with `product_id`, `sku`, `name`, `price`, `stock_quantity`, `attributes`. Added `ProductVariant` model and `Product::variants()` hasMany relationship.
- **Task 3c — Reviews**: Created `reviews` table with `user_id`, `product_id`, `rating`, `body`, `is_approved`. Unique compound index `(user_id, product_id)` enforces one review per user per product at the DB level. Added `Review` model with `Product::reviews()` and `User::reviews()` relationships.
- **Task 3d — Engraving Text on Order Items**: Added nullable `engraving_text` column to `order_items` and included in `OrderItem::$fillable`.
- **Task 3e — Stripe Customer ID on Users**: Added nullable unique `stripe_customer_id` column to `users` and included in `User::$fillable`.

#### Test Coverage
- **19 new tests** added across `AuthHardeningTest` and `SchemaMigrationTest`.
- **77/77 total tests** pass with 0 regressions (`php artisan test`).
- TDD methodology followed: all tests written before implementation code (RED → GREEN).

#### Files Changed
| File | Change |
|---|---|
| `backend/config/sanctum.php` | `expiration` → `15` |
| `backend/app/Http/Controllers/Auth/AuthController.php` | HttpOnly cookie auth, refresh, forgot/reset password |
| `backend/routes/api.php` | Added `/token/refresh`, `/forgot-password`, `/reset-password` routes |
| `backend/app/Providers/AppServiceProvider.php` | `ResetPassword::createUrlUsing()` for frontend URL |
| `backend/database/migrations/...create_products_table.php` | Added `softDeletes()` |
| `backend/database/migrations/...create_order_items_table.php` | Added `engraving_text` |
| `backend/database/migrations/0001_01_01_000000_create_users_table.php` | Added `stripe_customer_id` |
| `backend/database/migrations/2026_05_26_000001_create_product_variants_table.php` | **New** — product variants |
| `backend/database/migrations/2026_05_26_000002_create_reviews_table.php` | **New** — reviews with unique index |
| `backend/app/Models/Product.php` | `SoftDeletes`, `variants()`, `reviews()` |
| `backend/app/Models/User.php` | `stripe_customer_id` in `$fillable`, `reviews()` relationship |
| `backend/app/Models/OrderItem.php` | `engraving_text` in `$fillable` |
| `backend/app/Models/ProductVariant.php` | **New** model |
| `backend/app/Models/Review.php` | **New** model |
| `backend/database/factories/ProductFactory.php` | **New** factory for tests |
| `frontend/src/lib/apiClient.ts` | Removed Bearer token interceptor |
| `frontend/src/lib/auth.ts` | Removed token from state; cookie-based session model |

<br/>

### 📦 Order Management System (Filament)
- Began scaffolding the Unified Order Management system within Filament.
- Implemented `OrdersTable` resource with robust column configurations (ID, Customer, Order Type, Status, Payment Status, Totals, Items count).
- Added multi-select filters and date range filters for powerful querying of both Wholesale and Partner orders.

<br/>

## 📄 License
This project is proprietary and confidential.

---
<p align="center">
  <sub>Luxury Crafted with Precision · <strong>Om Gems</strong> · 2026</sub>
</p>
