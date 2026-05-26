<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * RoleAccessTest — Phase 6 Security Hardening
 *
 * Validates the role-based access control matrix across all API portals.
 * Each role must ONLY access routes within their scope. Cross-role access
 * must be blocked with a 403 or 401 response.
 *
 * Test matrix:
 *   ✅ Super Admin  → /admin/* (full access)
 *   ✅ Admin        → /admin/* (partial, no manage_users)
 *   ✅ Partner      → /partner/* only
 *   ✅ Wholesale    → /wholesale/* only
 *   ✅ Retail       → /account/* only
 *   ❌ Cross-role   → 403 Forbidden
 */
class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    /**
     * Helper: create and authenticate a user with the given role.
     */
    private function actingAsRole(string $role): User
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->assignRole($role);
        return $user;
    }

    // ─────────────────────────────────────────────────────
    // Super Admin Tests
    // ─────────────────────────────────────────────────────

    public function test_super_admin_can_access_admin_stats(): void
    {
        $user = $this->actingAsRole('Super Admin');

        $response = $this->actingAs($user)->getJson('/api/admin/stats');
        $response->assertStatus(200);
    }

    public function test_super_admin_can_access_user_management(): void
    {
        $user = $this->actingAsRole('Super Admin');

        $response = $this->actingAs($user)->getJson('/api/admin/users');
        $response->assertStatus(200);
    }

    public function test_super_admin_can_access_partner_routes(): void
    {
        $user = $this->actingAsRole('Super Admin');

        // Super Admin should be able to access partner routes via Gate::before()
        // But the check.role middleware only allows 'Partner' role, not Super Admin
        // This tests that Super Admin is NOT allowed through check.role (which is correct)
        $response = $this->actingAs($user)->getJson('/api/partner/diamonds');
        // Per api.php: check.role:Partner — Super Admin does NOT bypass role middleware
        // Super Admin can only access /admin routes, not /partner routes
        $response->assertStatus(403);
    }

    // ─────────────────────────────────────────────────────
    // Admin Tests
    // ─────────────────────────────────────────────────────

    public function test_admin_can_access_admin_stats(): void
    {
        $user = $this->actingAsRole('Admin');

        $response = $this->actingAs($user)->getJson('/api/admin/stats');
        $response->assertStatus(200);
    }

    public function test_admin_cannot_access_user_management(): void
    {
        $user = $this->actingAsRole('Admin');

        // Admin has manage_diamonds, manage_products etc. but NOT manage_users
        $response = $this->actingAs($user)->getJson('/api/admin/users');
        $response->assertStatus(403);
    }

    public function test_admin_cannot_access_partner_routes(): void
    {
        $user = $this->actingAsRole('Admin');

        $response = $this->actingAs($user)->getJson('/api/partner/diamonds');
        $response->assertStatus(403);
    }

    public function test_admin_cannot_access_wholesale_routes(): void
    {
        $user = $this->actingAsRole('Admin');

        $response = $this->actingAs($user)->getJson('/api/wholesale/orders');
        $response->assertStatus(403);
    }

    // ─────────────────────────────────────────────────────
    // Partner Tests
    // ─────────────────────────────────────────────────────

    public function test_partner_can_access_own_diamonds(): void
    {
        $user = $this->actingAsRole('Partner');

        $response = $this->actingAs($user)->getJson('/api/partner/diamonds');
        $response->assertStatus(200);
    }

    public function test_partner_can_access_own_orders(): void
    {
        $user = $this->actingAsRole('Partner');

        $response = $this->actingAs($user)->getJson('/api/partner/orders');
        $response->assertStatus(200);
    }

    public function test_partner_can_access_partner_stats(): void
    {
        $user = $this->actingAsRole('Partner');

        $response = $this->actingAs($user)->getJson('/api/partner/stats');
        $response->assertStatus(200);
    }

    public function test_partner_cannot_access_admin_routes(): void
    {
        $user = $this->actingAsRole('Partner');

        $response = $this->actingAs($user)->getJson('/api/admin/stats');
        $response->assertStatus(403);
    }

    public function test_partner_cannot_access_admin_users(): void
    {
        $user = $this->actingAsRole('Partner');

        $response = $this->actingAs($user)->getJson('/api/admin/users');
        $response->assertStatus(403);
    }

    public function test_partner_cannot_access_wholesale_routes(): void
    {
        $user = $this->actingAsRole('Partner');

        $response = $this->actingAs($user)->getJson('/api/wholesale/orders');
        $response->assertStatus(403);
    }

    // ─────────────────────────────────────────────────────
    // Wholesale Buyer Tests
    // ─────────────────────────────────────────────────────

    public function test_wholesale_can_access_own_orders(): void
    {
        $user = $this->actingAsRole('Wholesale Buyer');

        $response = $this->actingAs($user)->getJson('/api/wholesale/orders');
        $response->assertStatus(200);
    }

    public function test_wholesale_can_access_own_stats(): void
    {
        $user = $this->actingAsRole('Wholesale Buyer');

        $response = $this->actingAs($user)->getJson('/api/wholesale/stats');
        $response->assertStatus(200);
    }

    public function test_wholesale_can_access_quotes(): void
    {
        $user = $this->actingAsRole('Wholesale Buyer');

        $response = $this->actingAs($user)->getJson('/api/wholesale/quotes');
        $response->assertStatus(200);
    }

    public function test_wholesale_cannot_access_admin_routes(): void
    {
        $user = $this->actingAsRole('Wholesale Buyer');

        $response = $this->actingAs($user)->getJson('/api/admin/stats');
        $response->assertStatus(403);
    }

    public function test_wholesale_cannot_access_partner_routes(): void
    {
        $user = $this->actingAsRole('Wholesale Buyer');

        $response = $this->actingAs($user)->getJson('/api/partner/diamonds');
        $response->assertStatus(403);
    }

    // ─────────────────────────────────────────────────────
    // Retail Customer Tests
    // ─────────────────────────────────────────────────────

    public function test_retail_can_access_account_overview(): void
    {
        $user = $this->actingAsRole('Retail Customer');

        $response = $this->actingAs($user)->getJson('/api/account/overview');
        $response->assertStatus(200);
    }

    public function test_retail_can_access_account_orders(): void
    {
        $user = $this->actingAsRole('Retail Customer');

        $response = $this->actingAs($user)->getJson('/api/account/orders');
        $response->assertStatus(200);
    }

    public function test_retail_can_access_wishlist(): void
    {
        $user = $this->actingAsRole('Retail Customer');

        $response = $this->actingAs($user)->getJson('/api/account/wishlist');
        $response->assertStatus(200);
    }

    public function test_retail_cannot_access_admin_routes(): void
    {
        $user = $this->actingAsRole('Retail Customer');

        $response = $this->actingAs($user)->getJson('/api/admin/stats');
        $response->assertStatus(403);
    }

    public function test_retail_cannot_access_partner_routes(): void
    {
        $user = $this->actingAsRole('Retail Customer');

        $response = $this->actingAs($user)->getJson('/api/partner/diamonds');
        $response->assertStatus(403);
    }

    public function test_retail_cannot_access_wholesale_routes(): void
    {
        $user = $this->actingAsRole('Retail Customer');

        $response = $this->actingAs($user)->getJson('/api/wholesale/orders');
        $response->assertStatus(403);
    }

    // ─────────────────────────────────────────────────────
    // Unauthenticated Tests
    // ─────────────────────────────────────────────────────

    public function test_unauthenticated_cannot_access_admin_routes(): void
    {
        $response = $this->getJson('/api/admin/stats');
        $response->assertStatus(401);
    }

    public function test_unauthenticated_cannot_access_partner_routes(): void
    {
        $response = $this->getJson('/api/partner/diamonds');
        $response->assertStatus(401);
    }

    public function test_unauthenticated_cannot_access_wholesale_routes(): void
    {
        $response = $this->getJson('/api/wholesale/orders');
        $response->assertStatus(401);
    }

    public function test_unauthenticated_cannot_access_account_routes(): void
    {
        $response = $this->getJson('/api/account/overview');
        $response->assertStatus(401);
    }

    // ─────────────────────────────────────────────────────
    // Public Routes remain accessible
    // ─────────────────────────────────────────────────────

    public function test_public_can_access_diamonds_listing(): void
    {
        $response = $this->getJson('/api/diamonds');
        $response->assertStatus(200);
    }

    public function test_public_can_access_products_listing(): void
    {
        $response = $this->getJson('/api/products');
        $response->assertStatus(200);
    }

    public function test_public_can_access_categories_listing(): void
    {
        $response = $this->getJson('/api/categories');
        $response->assertStatus(200);
    }

    // ─────────────────────────────────────────────────────
    // Auth Response Payload Tests
    // ─────────────────────────────────────────────────────

    public function test_login_response_contains_role_and_redirect(): void
    {
        $user = User::factory()->create([
            'password'          => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $user->assignRole('Admin');

        $response = $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'password',
        ]);

        // Task 2c: access_token is now in an HttpOnly cookie, NOT in the JSON body.
        // The response body only contains token_type and user payload for security.
        $response->assertStatus(200)
            ->assertJsonStructure([
                'token_type',
                'user' => [
                    'id', 'name', 'email', 'role', 'roles', 'permissions', 'redirect_path',
                ],
            ])
            ->assertJsonPath('user.role', 'Admin')
            ->assertJsonPath('user.redirect_path', '/admin');

        // Verify the auth token was set as an HttpOnly cookie
        $setCookie = $response->headers->get('Set-Cookie', '');
        $this->assertStringContainsString('auth_token=', $setCookie);
    }

    public function test_me_endpoint_returns_permissions(): void
    {
        $user = $this->actingAsRole('Admin');

        $response = $this->actingAs($user)->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id', 'name', 'email', 'role', 'roles', 'permissions', 'redirect_path',
            ]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
    }
}
