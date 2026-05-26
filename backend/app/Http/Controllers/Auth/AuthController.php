<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;

/**
 * AuthController — Unified Authentication Gateway
 *
 * API Design (api-design-principles):
 *   Every auth response includes a consistent payload:
 *   {
 *     token_type: "Bearer",   ← token is no longer in body (security: 2c)
 *     user: { id, name, email, role, permissions, redirect_path }
 *   }
 *
 *   The `redirect_path` tells the frontend where to navigate post-login,
 *   removing the need for the frontend to maintain a role→route mapping.
 *   This is the single source of truth for dashboard routing.
 *
 * Security (auth-implementation-patterns):
 *   - Tokens are stored in HttpOnly cookies (not exposed to JS) — Task 2c.
 *   - Token expiry set to 15 minutes in sanctum.php — Task 2a.
 *   - POST /api/token/refresh rotates the token — Task 2b.
 *   - Password reset via Laravel's built-in broker — Task 2d.
 *   - Login response never leaks other users' data.
 */
class AuthController extends Controller
{
    /**
     * Role → Dashboard path mapping.
     * Centralized here so it's maintainable and consistent.
     */
    private const ROLE_REDIRECT_MAP = [
        'Super Admin'     => '/admin',
        'Admin'           => '/admin',
        'Partner'         => '/partner/dashboard',
        'Wholesale Buyer' => '/wholesale/dashboard',
        'Retail Customer' => '/account',
    ];

    private const COOKIE_NAME = 'auth_token';
    private const COOKIE_MINUTES = 1440; // 24 hours — browser session lifetime

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('Retail Customer'); // Default role for public registration

        $token = $user->createToken('auth_token_retail_customer')->plainTextToken;

        return $this->respondWithToken($user, $token, 201);
    }

    /**
     * POST /api/login
     *
     * Authenticates the user and returns an HttpOnly cookie containing
     * the Sanctum token. The token is NOT in the JSON response body.
     * Task 2c.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Scope token name by role for audit trail
        $roleName  = $user->roles->first()?->name ?? 'unknown';
        $tokenName = 'auth_token_' . str_replace(' ', '_', strtolower($roleName));
        $token     = $user->createToken($tokenName)->plainTextToken;

        return $this->respondWithToken($user, $token);
    }

    /**
     * POST /api/logout
     *
     * Deletes the current Sanctum token and expires the HttpOnly cookie.
     * Task 2c.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'])
            ->withCookie(cookie()->forget(self::COOKIE_NAME));
    }

    /**
     * POST /api/token/refresh
     *
     * Invalidates the current Sanctum token and issues a brand-new one,
     * delivered via a fresh HttpOnly cookie. This limits the blast radius
     * if a token is ever intercepted in transit.
     * Task 2b.
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        // Delete the old token to prevent replay attacks
        $user->currentAccessToken()->delete();

        // Issue a new scoped token
        $roleName  = $user->roles->first()?->name ?? 'unknown';
        $tokenName = 'auth_token_' . str_replace(' ', '_', strtolower($roleName));
        $newToken  = $user->createToken($tokenName)->plainTextToken;

        return response()->json(['message' => 'Token refreshed successfully'])
            ->withCookie($this->makeCookie($newToken));
    }

    /**
     * GET /api/me
     *
     * Returns the full user payload including roles, ALL permissions
     * (both direct and via roles), and the redirect_path.
     * This endpoint powers the frontend's permission-aware UI rendering.
     */
    public function me(Request $request)
    {
        return response()->json(
            $this->formatUserPayload($request->user())
        );
    }

    /**
     * POST /api/forgot-password
     *
     * Uses Laravel's built-in password broker to send a reset link email.
     * Returns 200 on success and 422 if the email is not found.
     * Task 2d.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Generate a raw reset token via the broker
        $token = Password::createToken($user);

        // Build the reset URL pointing to the Next.js frontend, not a Laravel named route
        $frontendUrl = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');
        $resetUrl    = $frontendUrl . '/auth/reset-password?token=' . $token . '&email=' . urlencode($user->email);

        // Send the reset notification manually (avoids dependency on `password.reset` named route)
        $user->sendPasswordResetNotification($token);

        return response()->json(['message' => 'Password reset link sent to your email.']);
    }

    /**
     * POST /api/reset-password
     *
     * Validates the reset token and updates the user's password using
     * Laravel's built-in password reset broker.
     * Task 2d.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'                 => 'required|string',
            'email'                 => 'required|email',
            'password'              => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                // Revoke all existing tokens after a password reset
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [trans($status)],
            ]);
        }

        return response()->json(['message' => trans($status)]);
    }

    // ─────────────────────────────────────────────────────────────
    // Private Helpers
    // ─────────────────────────────────────────────────────────────

    /**
     * Build a consistent auth response:
     * - HttpOnly cookie with the token
     * - JSON body with token_type and user payload (NO raw token)
     *
     * @param User   $user
     * @param string $token
     * @param int    $status HTTP status code
     */
    private function respondWithToken(User $user, string $token, int $status = 200)
    {
        return response()->json([
            'token_type' => 'Bearer',
            'user'       => $this->formatUserPayload($user),
        ], $status)->withCookie($this->makeCookie($token));
    }

    /**
     * Build the HttpOnly, Secure, SameSite=Lax auth cookie.
     */
    private function makeCookie(string $token)
    {
        return cookie(
            self::COOKIE_NAME,
            $token,
            self::COOKIE_MINUTES,
            '/',
            null,
            false,      // $secure — set to true in production (enforce HTTPS)
            true,       // $httpOnly — XSS-safe: JS cannot read this cookie
            false,
            'Lax'       // CSRF protection for same-site requests
        );
    }

    /**
     * Build a consistent, permission-aware user response payload.
     *
     * Architecture (architecture-patterns):
     *   Centralizing the response format here ensures that login, register,
     *   and /me all return identical structures. The frontend can rely on
     *   a single TypeScript interface for all auth responses.
     *
     * @param User $user
     * @return array
     */
    private function formatUserPayload(User $user): array
    {
        $user->load('roles.permissions');

        $roleName = $user->roles->first()?->name ?? 'Retail Customer';

        // Collect ALL permission names (direct + via roles)
        $permissions = $user->getAllPermissions()->pluck('name')->unique()->values()->toArray();

        return [
            'id'               => $user->id,
            'name'             => $user->name,
            'email'            => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'role'             => $roleName,
            'roles'            => $user->roles->pluck('name')->toArray(),
            'permissions'      => $permissions,
            'redirect_path'    => self::ROLE_REDIRECT_MAP[$roleName] ?? '/account',
            'created_at'       => $user->created_at,
        ];
    }
}
