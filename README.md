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
    <a href="#demo"><strong>Demo</strong></a>
  </p>
</p>

<br/>

## 🌟 Overview

**Om Gems** is a premium, full-stack B2B e-commerce platform built for the high-end jewellery and diamond industry. Designed with a **"Quiet Luxury"** aesthetic inspired by maisons like Cartier and Harry Winston, it combines cinematic web design with robust business functionality.

The platform serves as both a **consumer-facing luxury showcase** and a **professional B2B portal** for institutional diamond buyers, featuring GIA-certified inventory management, wholesale pricing, and partner applications.

<br/>

## 🎬 Demo

<p align="center">
  <img src="docs/site-demo.webp" alt="Om Gems — Full Site Walkthrough" width="100%" />
</p>

<p align="center"><em>Full walkthrough: Homepage → Diamonds → Jewelry → High-Jewelry → Maison → Partner Portal</em></p>

<br/>

## ✨ Features

### 🛍️ Consumer Experience
- **Cinematic Hero** — Full-screen video background with parallax scrolling and GSAP/Framer Motion animations
- **High-Jewelry Editorial** — Magazine-style product showcases with grayscale-to-color hover effects
- **Collection Catalog** — Browse by category (Rings, Necklaces, Earrings, Bracelets)
- **Product Detail Pages** — Immersive product views with image carousels
- **Newsletter Subscription** — "The Maison Journal" signup for exclusive content

### 💎 B2B Diamond Portal
- **GIA-Certified Inventory** — Real-time access to global diamond stock
- **Wholesale Pricing Matrix** — Professional-grade pricing for institutional buyers
- **Memo Procurement Services** — Specialized diamond sourcing
- **Partner Application** — Streamlined onboarding for new business partners

### 🔐 Authentication & Security
- **Laravel Sanctum** — Token-based API authentication
- **Role-Based Access Control** — Spatie Laravel Permission with Admin/Partner/User roles
- **Protected B2B Routes** — Institutional-only access with partner verification

<br/>

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router & Turbopack |
| **React 19** | UI component library |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Declarative animations & page transitions |
| **GSAP** | High-performance scroll animations |
| **Zustand** | Lightweight state management |
| **Axios** | HTTP client for API communication |

### Backend
| Technology | Purpose |
|---|---|
| **Laravel 13** | PHP framework for RESTful API |
| **Laravel Sanctum** | SPA & token authentication |
| **Spatie Permission** | Role & permission management |
| **MySQL / SQLite** | Relational database |
| **PHP 8.3+** | Server-side language |

<br/>

## 📁 Project Structure

```
e-commerce-next.js/
├── frontend/                    # Next.js 16 Application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── page.tsx         # Home — Cinematic landing
│   │   │   ├── diamonds/        # B2B Diamond portal
│   │   │   ├── jewelry/         # Collection catalog
│   │   │   │   ├── [category]/  # Dynamic category pages
│   │   │   │   └── product/     # Product detail pages
│   │   │   ├── high-jewelry/    # High-jewelry editorial
│   │   │   ├── maison/          # Brand heritage story
│   │   │   └── partner/         # B2B partner application
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   └── ui/              # Custom cursor, shared UI
│   │   ├── lib/                 # API client, utilities
│   │   └── store/               # Zustand state management
│   └── public/                  # Static assets & media
│
├── backend/                     # Laravel 13 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/     # API controllers
│   │   │   └── Requests/        # Form request validation
│   │   ├── Models/              # Eloquent models
│   │   └── Providers/           # Service providers
│   ├── database/
│   │   ├── migrations/          # Database schema
│   │   └── seeders/             # Mock data & role seeds
│   ├── routes/
│   │   ├── api.php              # API routes
│   │   └── web.php              # Web routes
│   └── config/                  # App configuration
│
└── docs/                        # Documentation & demo
```

<br/>

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **PHP** ≥ 8.3
- **Composer** ≥ 2.x
- **MySQL** or **SQLite**

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Seed initial data (roles & mock data)
php artisan db:seed

# Start the development server
php artisan serve
```

The API will be available at `http://localhost:8000`

<br/>

## 🔧 Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (`backend/.env`)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=omgems
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

<br/>

## 📜 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | Register new user |
| `POST` | `/api/login` | Authenticate user |
| `GET` | `/api/categories` | List all categories |
| `GET` | `/api/products` | Browse products |
| `GET` | `/api/diamonds` | Browse diamond inventory |
| `POST` | `/api/products` | Create product (Admin) |
| `PUT` | `/api/products/{id}` | Update product (Admin) |
| `DELETE` | `/api/products/{id}` | Delete product (Admin) |

<br/>

## 🎨 Design Philosophy

Om Gems follows a **"Quiet Luxury"** design language:

- **Typography** — Serif headings with ultra-light weight, sans-serif body copy with generous tracking
- **Color Palette** — Monochromatic base with subtle gold/champagne accents
- **Animations** — Cinematic parallax scrolling, grayscale-to-color image reveals, smooth page transitions
- **Layout** — Editorial grid layouts inspired by luxury fashion magazines
- **Interactions** — Custom cursor, hover-state color reveals, scroll-triggered animations

<br/>

## 📄 License

This project is proprietary and confidential. All rights reserved.

<br/>

---

<p align="center">
  <sub>Crafted with precision · <strong>Om Gems</strong> · Since 2026</sub>
</p>
