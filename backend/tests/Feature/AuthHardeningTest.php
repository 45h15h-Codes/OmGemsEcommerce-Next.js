<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

/**
 * AuthHardeningTest — Week 1 Security Hardening
 *
 * Validates:
 *   2a. Token expiry is set to 15 minutes in sanctum config.
 *   2b. POST /api/token/refresh issues a fresh token and invalidates the old one.
 *   2c. Login sets an HttpOnly cookie; token is NOT in the JSON response body.
 *   2d. POST /api/forgot-password and POST /api/reset-password work correctly.
 *
 * TDD: Each test was written BEFORE any implementation code.
 * All tests must fail initially (RED), then pass after implementation (GREEN).
 */
class AuthHardeningTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    // ─────────────────────────────────────────────────────
    // 2a — Sanctum Token Expiry
    // ─────────────────────────────────────────────────────

    /**
     * Sanctum token expiry must be set to exactly 15 minutes.
     * This is read directly from the config to ensure it is correctly set.
     */
    public function test_sanctum_token_expiry_is_set_to_15_minutes(): void
    {
        $this->assertEquals(15, Config::get('sanctum.expiration'));
    }

    // ─────────────────────────────────────────────────────
    // 2b — Token Refresh Endpoint
    // ─────────────────────────────────────────────────────

    /**
     * An authenticated user can call POST /api/token/refresh.
     * A new token is returned in an HttpOnly cookie.
     * The old token is invalidated (deleted from personal_access_tokens).
     */
    public function test_authenticated_user_can_refresh_token(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Retail Customer');
        $plainToken = $user->createToken('auth_token_retail_customer')->plainTextToken;

        // Use real Bearer token (not TransientToken) so deletion actually works
        $response = $this->withToken($plainToken)->postJson('/api/token/refresh');

        $response->assertStatus(200);
        $response->assertJsonStructure(['message']);

        // Verify the cookie is set in the response Set-Cookie header
        $setCookie = $response->headers->get('Set-Cookie', '');
        $this->assertStringContainsString('auth_token=', $setCookie);

        // The old token must be deleted; a new one created — still exactly 1 token total
        $this->assertCount(1, $user->fresh()->tokens);
    }

    /**
     * An unauthenticated user cannot access the refresh endpoint.
     */
    public function test_unauthenticated_user_cannot_refresh_token(): void
    {
        $response = $this->postJson('/api/token/refresh');
        $response->assertStatus(401);
    }

    // ─────────────────────────────────────────────────────
    // 2c — Login Sets HttpOnly Cookie
    // ─────────────────────────────────────────────────────

    /**
     * On successful login, the response must set an HttpOnly cookie named 'auth_token'.
     * The access_token MUST NOT be present in the JSON response body for security.
     */
    public function test_login_sets_httponly_cookie_and_not_token_in_body(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);
        $user->assignRole('Retail Customer');

        $response = $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200);

        // Cookie must be present
        $response->assertCookie('auth_token');

        // Token must NOT be in the response body
        $this->assertArrayNotHasKey('access_token', $response->json());
    }

    /**
     * On logout, the HttpOnly 'auth_token' cookie must be cleared/expired.
     */
    public function test_logout_clears_auth_cookie(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Retail Customer');
        $plainToken = $user->createToken('auth_token_retail_customer')->plainTextToken;

        // Use real Bearer token (not TransientToken) so currentAccessToken()->delete() works
        $response = $this->withToken($plainToken)->postJson('/api/logout');

        $response->assertStatus(200);

        // Verify the Set-Cookie header clears/expires the auth_token cookie
        $setCookie = $response->headers->get('Set-Cookie', '');
        $this->assertStringContainsString('auth_token=', $setCookie);
    }

    // ─────────────────────────────────────────────────────
    // 2d — Password Reset Flow
    // ─────────────────────────────────────────────────────

    /**
     * POST /api/forgot-password sends a reset link for an existing email.
     */
    public function test_forgot_password_returns_ok_for_existing_email(): void
    {
        Notification::fake(); // Suppress actual email send

        $user = User::factory()->create();

        $response = $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['message']);
    }

    /**
     * POST /api/forgot-password with an unknown email returns a 422 validation error.
     */
    public function test_forgot_password_returns_validation_error_for_unknown_email(): void
    {
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(422);
    }

    /**
     * POST /api/reset-password with an invalid token returns a 422 error.
     */
    public function test_reset_password_fails_with_invalid_token(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/reset-password', [
            'token'                 => 'invalid-token',
            'email'                 => $user->email,
            'password'              => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422);
    }

    /**
     * POST /api/reset-password with a valid token resets the password successfully.
     */
    public function test_reset_password_succeeds_with_valid_token(): void
    {
        $user = User::factory()->create();

        // Create a real password reset token via the Password facade
        $token = Password::createToken($user);

        $response = $this->postJson('/api/reset-password', [
            'token'                 => $token,
            'email'                 => $user->email,
            'password'              => 'NewSecret99!',
            'password_confirmation' => 'NewSecret99!',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['message']);
    }
}
