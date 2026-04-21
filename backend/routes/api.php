<?php

use App\Http\Controllers\Admin\NavLinkController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DiamondController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Partner\PartnerDashboardController;
use App\Http\Controllers\Partner\PartnerDiamondController;
use App\Http\Controllers\Partner\PartnerOrderController;
use App\Http\Controllers\Wholesale\WholesaleOrderController;
use App\Http\Controllers\Account\AccountController;

/*
|--------------------------------------------------------------------------
| API Routes — Role-Based Access Architecture
|--------------------------------------------------------------------------
|
| Route Organization (api-design-principles):
|   Routes are grouped by access level, not by resource. This makes it
|   immediately clear WHO can access WHAT just by reading the route file.
|
| Security Layers (api-security-best-practices):
|   Layer 1: auth:sanctum          → Is the user authenticated?
|   Layer 2: check.role            → Can this user enter this portal?
|   Layer 3: check.permission      → Can this user do this specific action?
|   Layer 4: Controller query scope → Can this user touch THIS specific record?
|
| Note: Super Admin bypasses Layers 2-3 automatically via Gate::before().
|       Layer 4 (query scoping) is the ONLY layer Super Admin does NOT bypass —
|       it's data-level, not permission-level. However, admin controllers
|       intentionally do NOT scope queries, giving Super Admin full visibility.
|
*/

// ─────────────────────────────────────────────────────────────
// Public Routes — No authentication required
// ─────────────────────────────────────────────────────────────

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public catalog endpoints (read-only)
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('diamonds', DiamondController::class)->only(['index', 'show']);

// Public CMS endpoints
Route::get('/public/settings', [SettingsController::class, 'publicIndex']);
Route::get('/public/nav-links', [NavLinkController::class, 'publicIndex']);
Route::get('/public/pages/{slug}', [PageController::class, 'publicShow']);


// ─────────────────────────────────────────────────────────────
// Authenticated Routes — Any logged-in user
// ─────────────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // Auth management
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);


    // ─────────────────────────────────────────────────────
    // Admin Routes — Super Admin & Admin only
    // ─────────────────────────────────────────────────────
    Route::prefix('admin')->middleware('check.role:Super Admin,Admin')->group(function () {

        // Dashboard Stats
        Route::get('stats', [DashboardController::class, 'stats']);

        // User management (requires manage_users or super admin)
        Route::middleware('check.permission:manage_users')->group(function () {
            Route::apiResource('users', UserController::class);
            Route::post('users/{id}/roles', [UserController::class, 'assignRoles']);
            Route::post('users/{id}/permissions', [UserController::class, 'assignPermissions']);
        });

        // Diamond management (requires manage_diamonds permission)
        Route::middleware('check.permission:manage_diamonds')->group(function () {
            Route::apiResource('diamonds', DiamondController::class)
                ->except(['index', 'show'])
                ->names([
                    'store' => 'admin.diamonds.store',
                    'update' => 'admin.diamonds.update',
                    'destroy' => 'admin.diamonds.destroy',
                ]);
        });

        // Product management (requires manage_products permission)
        Route::middleware('check.permission:manage_products')->group(function () {
            Route::apiResource('products', ProductController::class)
                ->except(['index', 'show'])
                ->names([
                    'store' => 'admin.products.store',
                    'update' => 'admin.products.update',
                    'destroy' => 'admin.products.destroy',
                ]);
        });

        // Category management (requires manage_categories permission)
        Route::middleware('check.permission:manage_categories')->group(function () {
            Route::apiResource('categories', CategoryController::class)
                ->except(['index', 'show'])
                ->names([
                    'store' => 'admin.categories.store',
                    'update' => 'admin.categories.update',
                    'destroy' => 'admin.categories.destroy',
                ]);
        });

        // Settings / CMS management (requires manage_settings permission)
        Route::middleware('check.permission:manage_settings')->group(function () {
            Route::apiResource('settings', \App\Http\Controllers\Admin\SettingsController::class)
                ->parameters(['settings' => 'key'])
                ->only(['index', 'show', 'update']);
            Route::post('settings/bulk-update', [\App\Http\Controllers\Admin\SettingsController::class, 'bulkUpdate']);

            Route::apiResource('nav-links', \App\Http\Controllers\Admin\NavLinkController::class);
            Route::post('nav-links/reorder', [\App\Http\Controllers\Admin\NavLinkController::class, 'reorder']);

            Route::apiResource('pages', \App\Http\Controllers\Admin\PageController::class);

            Route::apiResource('media', \App\Http\Controllers\Admin\MediaController::class)
                ->except(['show']);
        });
    });


    // ─────────────────────────────────────────────────────
    // Partner Routes — Vendors only
    // ─────────────────────────────────────────────────────
    Route::prefix('partner')->middleware('check.role:Partner')->group(function () {

        // Partner dashboard stats
        Route::get('stats', [PartnerDashboardController::class, 'stats']);

        // Partner diamond management (scoped to vendor_id = auth()->id())
        Route::apiResource('diamonds', PartnerDiamondController::class)->names([
            'index' => 'partner.diamonds.index',
            'store' => 'partner.diamonds.store',
            'show' => 'partner.diamonds.show',
            'update' => 'partner.diamonds.update',
            'destroy' => 'partner.diamonds.destroy',
        ]);
        Route::patch('diamonds/{id}/toggle', [PartnerDiamondController::class, 'toggleAvailability'])
            ->name('partner.diamonds.toggle');

        // Partner orders (diamonds belonging to this vendor)
        Route::get('orders', [PartnerOrderController::class, 'index'])->name('partner.orders.index');
        Route::get('orders/{id}', [PartnerOrderController::class, 'show'])->name('partner.orders.show');
    });


    // ─────────────────────────────────────────────────────
    // Wholesale Routes — B2B Buyers only
    // ─────────────────────────────────────────────────────
    Route::prefix('wholesale')->middleware('check.role:Wholesale Buyer')->group(function () {

        // Dashboard stats
        Route::get('stats', [WholesaleOrderController::class, 'stats']);

        // Order history (mock until Order model exists)
        Route::get('orders', [WholesaleOrderController::class, 'orders']);

        // Bulk quote requests
        Route::get('quotes', [WholesaleOrderController::class, 'quoteIndex']);
        Route::post('quotes', [WholesaleOrderController::class, 'quoteStore']);
        Route::get('quotes/{id}', [WholesaleOrderController::class, 'quoteShow']);
    });


    // ─────────────────────────────────────────────────────
    // Account Routes — Retail Customers
    // ─────────────────────────────────────────────────────
    Route::prefix('account')->group(function () {

        // Account overview
        Route::get('overview', [AccountController::class, 'overview']);

        // Order history (mock until Order model exists)
        Route::get('orders', [AccountController::class, 'orders']);

        // Wishlist CRUD
        Route::get('wishlist', [AccountController::class, 'wishlistIndex']);
        Route::post('wishlist', [AccountController::class, 'wishlistStore']);
        Route::delete('wishlist/{id}', [AccountController::class, 'wishlistDestroy']);

        // Profile update
        Route::put('profile', [AccountController::class, 'updateProfile']);
    });
});
