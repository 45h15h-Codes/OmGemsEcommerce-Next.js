<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * CheckPermission Middleware
 *
 * Enforces Spatie permission checks on protected routes.
 *
 * Architecture Pattern (architecture-patterns):
 *   This middleware sits AFTER auth:sanctum in the middleware stack.
 *   It assumes the user is already authenticated and checks if they hold
 *   the required permission. Super Admin bypass happens transparently via
 *   Gate::before() — this middleware doesn't need to know about it.
 *
 * Security (api-security-best-practices):
 *   - Returns a structured JSON 403 (not HTML) for API consumers.
 *   - Never leaks the required permission name in production responses
 *     to prevent information disclosure (configurable via permission.php).
 *   - Supports comma-separated permissions for multi-permission checks.
 *
 * Usage in routes:
 *   Route::middleware(['auth:sanctum', 'check.permission:manage_diamonds'])
 *   Route::middleware(['auth:sanctum', 'check.permission:manage_diamonds,manage_products'])
 */
class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $permissions  Comma-separated list of required permissions (ANY match passes)
     */
    public function handle(Request $request, Closure $next, string $permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
                'error' => 'auth_required',
            ], 401);
        }

        // Super Admin bypass — Spatie's hasAnyPermission() does NOT trigger
        // Laravel's Gate::before(), so we must check the role explicitly here.
        // This mirrors the Gate::before() bypass defined in AppServiceProvider.
        if ($user->hasRole('Super Admin')) {
            return $next($request);
        }

        // Split comma-separated permissions for OR-based matching.
        // The user needs at least ONE of the listed permissions.
        $permissionArray = explode(',', $permissions);

        if (!$user->hasAnyPermission($permissionArray)) {
            return response()->json([
                'message' => 'You do not have the required permissions to access this resource.',
                'error' => 'insufficient_permissions',
            ], 403);
        }

        return $next($request);
    }
}
