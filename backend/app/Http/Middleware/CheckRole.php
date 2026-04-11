<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * CheckRole Middleware
 *
 * Enforces role-level access on route groups. This is the coarse-grained gate
 * that says "only Admins/Super Admins can even reach the /admin/* endpoints",
 * while CheckPermission handles the fine-grained "can they do THIS specific action?"
 *
 * Architecture Pattern (architecture-patterns):
 *   Two-layer authorization:
 *     1. CheckRole   → "Can this user enter this portal?"  (route group level)
 *     2. CheckPermission → "Can this user perform this action?" (route level)
 *
 * Usage in routes:
 *   Route::middleware(['auth:sanctum', 'check.role:Super Admin,Admin'])
 *   Route::middleware(['auth:sanctum', 'check.role:Partner'])
 */
class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  One or more role names (user needs ANY one to pass)
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
                'error' => 'auth_required',
            ], 401);
        }

        if (!$user->hasAnyRole($roles)) {
            return response()->json([
                'message' => 'You do not have the required role to access this resource.',
                'error' => 'insufficient_role',
            ], 403);
        }

        return $next($request);
    }
}
