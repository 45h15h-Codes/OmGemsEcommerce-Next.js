<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DiamondController;
use App\Http\Controllers\Account\AccountController;
use App\Http\Controllers\Partner\PartnerDashboardController;
use App\Http\Controllers\Partner\PartnerDiamondController;
use App\Http\Controllers\Partner\PartnerOrderController;
use App\Http\Controllers\Wholesale\WholesaleOrderController;
use App\Models\Diamond;
use App\Models\NavLink;
use App\Models\SiteSetting;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes — Storefront & User Logic
|--------------------------------------------------------------------------
|
| These routes handle the Next.js frontend (minimalcarbon.in).
| Admin management is now handled by Filament at /ashish.
|
*/

// ─────────────────────────────────────────────────────────────
// Public Routes — No authentication required
// ─────────────────────────────────────────────────────────────

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password Reset Flow — Task 2d
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Public catalog endpoints (read-only)
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('diamonds', DiamondController::class)->only(['index', 'show']);

Route::prefix('public')->group(function () {
    Route::get('nav-links', function (Request $request) {
        return response()->json([
            'data' => NavLink::query()
                ->when($request->input('location'), fn($query, $location) => $query->where('location', $location))
                ->where('is_active', true)
                ->orderBy('order_index')
                ->get(),
        ]);
    });

    Route::get('settings', function () {
        return response()->json([
            'data' => SiteSetting::query()->get(),
        ]);
    });
});

Route::prefix('catalog')->group(function () {
    Route::get('products', [CatalogController::class, 'products']);
    Route::get('categories', [CatalogController::class, 'categories']);
    Route::get('filters', [CatalogController::class, 'filters']);
    Route::get('search', [CatalogController::class, 'search']);
    Route::get('home', [CatalogController::class, 'home']);
    Route::get('categories/{slug}', [CatalogController::class, 'category']);
    Route::get('collections/{slug}', [CatalogController::class, 'collection']);
    Route::get('products/{slug}', [CatalogController::class, 'product']);
});


// ─────────────────────────────────────────────────────────────
// Authenticated Routes — Any logged-in user
// ─────────────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // Auth management
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/token/refresh', [AuthController::class, 'refresh']); // Task 2b

    Route::prefix('admin')
        ->middleware(['check.role:Super Admin,Admin'])
        ->group(function () {
            Route::get('stats', function () {
                return response()->json([
                    'stats' => [
                        'total_users' => User::count(),
                        'total_diamonds' => Diamond::count(),
                        'total_orders' => 0,
                        'total_revenue' => 0,
                    ],
                    'recent_activity' => [],
                ]);
            })->middleware('check.permission:view_admin_dashboard');

            Route::get('users', function () {
                return response()->json(User::query()->with('roles')->latest()->paginate(15));
            })->middleware('check.permission:manage_users,roles.manage');
        });

    Route::prefix('partner')
        ->middleware(['check.role:Partner'])
        ->group(function () {
            Route::get('stats', [PartnerDashboardController::class, 'stats']);
            Route::get('orders', [PartnerOrderController::class, 'index']);
            Route::get('orders/{id}', [PartnerOrderController::class, 'show']);
            Route::apiResource('diamonds', PartnerDiamondController::class)->names('partner.diamonds');
            Route::patch('diamonds/{id}/toggle', [PartnerDiamondController::class, 'toggleAvailability']);
            Route::patch('diamonds/{id}/toggle-availability', [PartnerDiamondController::class, 'toggleAvailability']);
        });

    Route::prefix('wholesale')
        ->middleware(['check.role:Wholesale Buyer'])
        ->group(function () {
            Route::get('orders', [WholesaleOrderController::class, 'orders']);
            Route::get('stats', [WholesaleOrderController::class, 'stats']);
            Route::get('quotes', [WholesaleOrderController::class, 'quoteIndex']);
            Route::post('quotes', [WholesaleOrderController::class, 'quoteStore']);
            Route::get('quotes/{id}', [WholesaleOrderController::class, 'quoteShow']);
        });

    // Account Routes — Retail Customers
    Route::prefix('account')->group(function () {
        Route::get('overview', [AccountController::class, 'overview']);
        Route::get('orders', [AccountController::class, 'orders']);
        Route::get('wishlist', [AccountController::class, 'wishlistIndex']);
        Route::post('wishlist', [AccountController::class, 'wishlistStore']);
        Route::delete('wishlist/{id}', [AccountController::class, 'wishlistDestroy']);
        Route::put('profile', [AccountController::class, 'updateProfile']);
    });
});
