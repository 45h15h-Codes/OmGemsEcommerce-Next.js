<?php

namespace Tests\Feature;

use App\Models\Diamond;
use App\Models\Quote;
use App\Models\User;
use App\Models\Wishlist;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * PermissionScopingTest — Phase 6 Security Hardening
 *
 * Validates that data queries are properly scoped per user/role:
 * - Partners can ONLY see/edit their own diamonds
 * - Wholesale buyers can ONLY see their own quotes
 * - Retail customers can ONLY see their own wishlist
 * - IDOR prevention: accessing another user's resources returns 403/404
 */
class PermissionScopingTest extends TestCase
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
    private function createUserWithRole(string $role): User
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->assignRole($role);
        return $user;
    }

    // ─────────────────────────────────────────────────────
    // Partner Diamond Scoping (IDOR Prevention)
    // ─────────────────────────────────────────────────────

    public function test_partner_can_only_see_own_diamonds(): void
    {
        $partner1 = $this->createUserWithRole('Partner');
        $partner2 = $this->createUserWithRole('Partner');

        // Create diamonds for each partner
        $ownDiamond = Diamond::create([
            'certificate_number' => 'GIA-OWN-001',
            'lab' => 'GIA',
            'carat' => 1.0,
            'color' => 'D',
            'clarity' => 'VVS1',
            'cut' => 'Excellent',
            'shape' => 'Round',
            'price' => 5000,
            'is_available' => true,
            'vendor_id' => $partner1->id,
        ]);

        $otherDiamond = Diamond::create([
            'certificate_number' => 'GIA-OTHER-001',
            'lab' => 'GIA',
            'carat' => 2.0,
            'color' => 'E',
            'clarity' => 'VS1',
            'cut' => 'Very Good',
            'shape' => 'Princess',
            'price' => 10000,
            'is_available' => true,
            'vendor_id' => $partner2->id,
        ]);

        // Partner 1 should only see their own diamonds
        $response = $this->actingAs($partner1)->getJson('/api/partner/diamonds');
        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('GIA-OWN-001', $data[0]['certificate_number']);
    }

    public function test_partner_cannot_view_other_partners_diamond(): void
    {
        $partner1 = $this->createUserWithRole('Partner');
        $partner2 = $this->createUserWithRole('Partner');

        $otherDiamond = Diamond::create([
            'certificate_number' => 'GIA-OTHER-002',
            'lab' => 'GIA',
            'carat' => 1.5,
            'color' => 'F',
            'clarity' => 'VS2',
            'cut' => 'Excellent',
            'shape' => 'Oval',
            'price' => 7500,
            'is_available' => true,
            'vendor_id' => $partner2->id,
        ]);

        // Partner 1 tries to view Partner 2's diamond by ID → should get 404
        $response = $this->actingAs($partner1)->getJson("/api/partner/diamonds/{$otherDiamond->id}");
        $response->assertStatus(404);
    }

    public function test_partner_cannot_update_other_partners_diamond(): void
    {
        $partner1 = $this->createUserWithRole('Partner');
        $partner2 = $this->createUserWithRole('Partner');

        $otherDiamond = Diamond::create([
            'certificate_number' => 'GIA-OTHER-003',
            'lab' => 'GIA',
            'carat' => 1.5,
            'color' => 'G',
            'clarity' => 'SI1',
            'cut' => 'Very Good',
            'shape' => 'Cushion',
            'price' => 6000,
            'is_available' => true,
            'vendor_id' => $partner2->id,
        ]);

        // Partner 1 tries to update Partner 2's diamond → should get 404
        $response = $this->actingAs($partner1)->putJson("/api/partner/diamonds/{$otherDiamond->id}", [
            'price' => 1.00, // Try to set malicious price
        ]);
        $response->assertStatus(404);
    }

    public function test_partner_cannot_delete_other_partners_diamond(): void
    {
        $partner1 = $this->createUserWithRole('Partner');
        $partner2 = $this->createUserWithRole('Partner');

        $otherDiamond = Diamond::create([
            'certificate_number' => 'GIA-OTHER-004',
            'lab' => 'GIA',
            'carat' => 0.75,
            'color' => 'H',
            'clarity' => 'VS1',
            'cut' => 'Excellent',
            'shape' => 'Emerald',
            'price' => 3500,
            'is_available' => true,
            'vendor_id' => $partner2->id,
        ]);

        // Partner 1 tries to delete Partner 2's diamond → should get 404
        $response = $this->actingAs($partner1)->deleteJson("/api/partner/diamonds/{$otherDiamond->id}");
        $response->assertStatus(404);

        // Diamond should still exist
        $this->assertDatabaseHas('diamonds', ['id' => $otherDiamond->id]);
    }

    public function test_partner_cannot_toggle_other_partners_diamond(): void
    {
        $partner1 = $this->createUserWithRole('Partner');
        $partner2 = $this->createUserWithRole('Partner');

        $otherDiamond = Diamond::create([
            'certificate_number' => 'GIA-OTHER-005',
            'lab' => 'GIA',
            'carat' => 1.2,
            'color' => 'D',
            'clarity' => 'IF',
            'cut' => 'Excellent',
            'shape' => 'Round',
            'price' => 12000,
            'is_available' => true,
            'vendor_id' => $partner2->id,
        ]);

        // Partner 1 tries to toggle Partner 2's diamond → should get 404
        $response = $this->actingAs($partner1)->patchJson("/api/partner/diamonds/{$otherDiamond->id}/toggle");
        $response->assertStatus(404);
    }

    public function test_partner_store_diamond_forces_own_vendor_id(): void
    {
        $partner = $this->createUserWithRole('Partner');
        $otherPartner = $this->createUserWithRole('Partner');

        // Partner tries to create a diamond but sneaks in another vendor_id
        $response = $this->actingAs($partner)->postJson('/api/partner/diamonds', [
            'certificate_number' => 'GIA-HIJACK-001',
            'lab' => 'GIA',
            'carat' => 1.0,
            'color' => 'D',
            'clarity' => 'VVS1',
            'cut' => 'Excellent',
            'shape' => 'Round',
            'price' => 5000,
            'vendor_id' => $otherPartner->id, // Attempt to hijack
        ]);

        $response->assertStatus(201);

        // Verify the diamond was created with the AUTHENTICATED user's vendor_id
        $diamond = Diamond::where('certificate_number', 'GIA-HIJACK-001')->first();
        $this->assertEquals($partner->id, $diamond->vendor_id);
        $this->assertNotEquals($otherPartner->id, $diamond->vendor_id);
    }

    // ─────────────────────────────────────────────────────
    // Wholesale Quote Scoping
    // ─────────────────────────────────────────────────────

    public function test_wholesale_can_only_see_own_quotes(): void
    {
        $buyer1 = $this->createUserWithRole('Wholesale Buyer');
        $buyer2 = $this->createUserWithRole('Wholesale Buyer');

        // Create quotes for each buyer
        Quote::create([
            'user_id' => $buyer1->id,
            'items' => [['shape' => 'Round', 'carat_min' => 1.0, 'carat_max' => 2.0, 'quantity' => 5]],
            'status' => 'pending',
        ]);

        Quote::create([
            'user_id' => $buyer2->id,
            'items' => [['shape' => 'Princess', 'carat_min' => 0.5, 'carat_max' => 1.0, 'quantity' => 10]],
            'status' => 'pending',
        ]);

        // Buyer 1 should only see their own quotes
        $response = $this->actingAs($buyer1)->getJson('/api/wholesale/quotes');
        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals($buyer1->id, $data[0]['user_id']);
    }

    public function test_wholesale_cannot_view_other_buyers_quote(): void
    {
        $buyer1 = $this->createUserWithRole('Wholesale Buyer');
        $buyer2 = $this->createUserWithRole('Wholesale Buyer');

        $otherQuote = Quote::create([
            'user_id' => $buyer2->id,
            'items' => [['shape' => 'Oval', 'carat_min' => 1.5, 'carat_max' => 3.0, 'quantity' => 3]],
            'status' => 'pending',
        ]);

        // Buyer 1 tries to view Buyer 2's quote → should get 404
        $response = $this->actingAs($buyer1)->getJson("/api/wholesale/quotes/{$otherQuote->id}");
        $response->assertStatus(404);
    }

    // ─────────────────────────────────────────────────────
    // Retail Wishlist Scoping
    // ─────────────────────────────────────────────────────

    public function test_retail_can_only_see_own_wishlist(): void
    {
        $customer1 = $this->createUserWithRole('Retail Customer');
        $customer2 = $this->createUserWithRole('Retail Customer');

        $diamond = Diamond::create([
            'certificate_number' => 'GIA-WISH-001',
            'lab' => 'GIA',
            'carat' => 0.5,
            'color' => 'E',
            'clarity' => 'VS1',
            'cut' => 'Excellent',
            'shape' => 'Round',
            'price' => 2000,
            'is_available' => true,
            'vendor_id' => null,
        ]);

        Wishlist::create(['user_id' => $customer1->id, 'diamond_id' => $diamond->id]);
        Wishlist::create(['user_id' => $customer2->id, 'diamond_id' => $diamond->id]);

        // Customer 1 should only see their own wishlist
        $response = $this->actingAs($customer1)->getJson('/api/account/wishlist');
        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals($customer1->id, $data[0]['user_id']);
    }

    public function test_retail_cannot_delete_other_users_wishlist_item(): void
    {
        $customer1 = $this->createUserWithRole('Retail Customer');
        $customer2 = $this->createUserWithRole('Retail Customer');

        $diamond = Diamond::create([
            'certificate_number' => 'GIA-WISH-002',
            'lab' => 'GIA',
            'carat' => 0.75,
            'color' => 'F',
            'clarity' => 'VS2',
            'cut' => 'Very Good',
            'shape' => 'Princess',
            'price' => 3000,
            'is_available' => true,
            'vendor_id' => null,
        ]);

        $otherItem = Wishlist::create(['user_id' => $customer2->id, 'diamond_id' => $diamond->id]);

        // Customer 1 tries to delete Customer 2's wishlist item → should get 404
        $response = $this->actingAs($customer1)->deleteJson("/api/account/wishlist/{$otherItem->id}");
        $response->assertStatus(404);

        // Item should still exist
        $this->assertDatabaseHas('wishlists', ['id' => $otherItem->id]);
    }

    // ─────────────────────────────────────────────────────
    // Profile Scoping
    // ─────────────────────────────────────────────────────

    public function test_retail_can_update_own_profile(): void
    {
        $customer = $this->createUserWithRole('Retail Customer');

        $response = $this->actingAs($customer)->putJson('/api/account/profile', [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('user.name', 'Updated Name');
    }

    // ─────────────────────────────────────────────────────
    // Token Security Tests
    // ─────────────────────────────────────────────────────

    public function test_expired_token_returns_401(): void
    {
        $user = $this->createUserWithRole('Retail Customer');

        // Create a token then delete it to simulate expiry
        $token = $user->createToken('test_token');
        $token->accessToken->delete();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token->plainTextToken,
        ])->getJson('/api/me');

        $response->assertStatus(401);
    }

    public function test_invalid_token_returns_401(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token-12345',
        ])->getJson('/api/me');

        $response->assertStatus(401);
    }

    // ─────────────────────────────────────────────────────
    // Input Validation Tests
    // ─────────────────────────────────────────────────────

    public function test_partner_diamond_store_validates_required_fields(): void
    {
        $partner = $this->createUserWithRole('Partner');

        $response = $this->actingAs($partner)->postJson('/api/partner/diamonds', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['certificate_number', 'lab', 'carat', 'color', 'clarity', 'shape', 'price']);
    }

    public function test_partner_diamond_store_rejects_negative_price(): void
    {
        $partner = $this->createUserWithRole('Partner');

        $response = $this->actingAs($partner)->postJson('/api/partner/diamonds', [
            'certificate_number' => 'GIA-NEG-001',
            'lab' => 'GIA',
            'carat' => 1.0,
            'color' => 'D',
            'clarity' => 'VVS1',
            'shape' => 'Round',
            'price' => -100,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['price']);
    }

    public function test_wholesale_quote_validates_items(): void
    {
        $buyer = $this->createUserWithRole('Wholesale Buyer');

        $response = $this->actingAs($buyer)->postJson('/api/wholesale/quotes', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['items']);
    }

    public function test_wishlist_requires_diamond_or_product_id(): void
    {
        $customer = $this->createUserWithRole('Retail Customer');

        $response = $this->actingAs($customer)->postJson('/api/account/wishlist', []);
        $response->assertStatus(422);
    }

    public function test_wishlist_rejects_duplicate_items(): void
    {
        $customer = $this->createUserWithRole('Retail Customer');

        $diamond = Diamond::create([
            'certificate_number' => 'GIA-DUP-001',
            'lab' => 'GIA',
            'carat' => 0.5,
            'color' => 'E',
            'clarity' => 'VS1',
            'cut' => 'Excellent',
            'shape' => 'Round',
            'price' => 2000,
            'is_available' => true,
            'vendor_id' => null,
        ]);

        // First add should succeed
        $response1 = $this->actingAs($customer)->postJson('/api/account/wishlist', ['diamond_id' => $diamond->id]);
        $response1->assertStatus(201);

        // Second add should return 409 Conflict
        $response2 = $this->actingAs($customer)->postJson('/api/account/wishlist', ['diamond_id' => $diamond->id]);
        $response2->assertStatus(409);
    }
}
