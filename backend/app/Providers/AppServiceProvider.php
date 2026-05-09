<?php

namespace App\Providers;

use App\Models\CatalogCollection;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;

/**
 * AppServiceProvider
 *
 * Auth Implementation Pattern (auth-implementation-patterns):
 *   The Gate::before() callback is the SINGLE source of truth for the
 *   Super Admin bypass. Every permission check — whether from Spatie's
 *   hasPermissionTo(), the CheckPermission middleware, or Laravel's
 *   Gate::allows() — passes through this callback first.
 *
 * Security (api-security-best-practices):
 *   By centralizing the bypass here instead of scattering `if (isSuperAdmin)`
 *   checks throughout controllers, we guarantee that:
 *   1. It's impossible to forget the bypass on a new endpoint.
 *   2. It's trivially auditable — one line to review.
 *   3. If we ever need to revoke Super Admin bypass (e.g. for a maintenance
 *      lock), we change ONE line of code.
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ─────────────────────────────────────────────────────
        // Super Admin Gate Bypass
        // ─────────────────────────────────────────────────────
        // Returning true from Gate::before() bypasses ALL subsequent
        // permission checks. Returning null falls through to normal checks.
        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });

        foreach ([Product::class, Category::class, CatalogCollection::class] as $model) {
            $model::saved(fn () => $this->flushCatalogCache());
            $model::deleted(fn () => $this->flushCatalogCache());
        }
    }

    private function flushCatalogCache(): void
    {
        Cache::forget('catalog.categories.tree');
        Cache::forget('catalog.home');
    }
}
