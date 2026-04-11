<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * AuthController — Unified Authentication Gateway
 *
 * API Design (api-design-principles):
 *   Every auth response includes a consistent payload:
 *   {
 *     access_token: "...",
 *     token_type: "Bearer",
 *     user: { id, name, email, role, permissions, redirect_path }
 *   }
 *
 *   The `redirect_path` tells the frontend where to navigate post-login,
 *   removing the need for the frontend to maintain a role→route mapping.
 *   This is the single source of truth for dashboard routing.
 *
 * Security (auth-implementation-patterns):
 *   - Tokens are scoped by role name for audit trail.
 *   - Login response never leaks other users' data.
 *   - The /me endpoint returns the currently authenticated user's full
 *     permission set, enabling the frontend to render UI conditionally.
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

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('Retail Customer'); // Default role for public registration

        $token = $user->createToken('auth_token_retail_customer')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->formatUserPayload($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Scope token name by role for audit trail
        $roleName = $user->roles->first()?->name ?? 'unknown';
        $tokenName = 'auth_token_' . str_replace(' ', '_', strtolower($roleName));
        $token = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->formatUserPayload($user),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
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
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'role' => $roleName,
            'roles' => $user->roles->pluck('name')->toArray(),
            'permissions' => $permissions,
            'redirect_path' => self::ROLE_REDIRECT_MAP[$roleName] ?? '/account',
            'created_at' => $user->created_at,
        ];
    }
}
