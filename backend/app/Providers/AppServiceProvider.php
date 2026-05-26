<?php

namespace App\Providers;

use App\Models\CatalogCollection;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Auth\Notifications\ResetPassword;
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
        // Password Reset URL — Task 2d
        // ─────────────────────────────────────────────────────
        // Override the default reset URL (which uses the `password.reset` named
        // Laravel route) to point to the Next.js frontend instead.
        // This is the correct pattern for decoupled SPA + API architectures.
        ResetPassword::createUrlUsing(function ($notifiable, string $token) {
            $frontendUrl = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');
            return $frontendUrl . '/auth/reset-password?token=' . $token . '&email=' . urlencode($notifiable->getEmailForPasswordReset());
        });

        // ─────────────────────────────────────────────────────
        // Super Admin Gate Bypass
        // ─────────────────────────────────────────────────────
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
