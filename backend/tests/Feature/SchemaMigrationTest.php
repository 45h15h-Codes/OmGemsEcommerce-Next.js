<?php

namespace Tests\Feature;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * SchemaMigrationTest — Week 1 Schema Tasks
 *
 * Validates:
 *   3a. Products table has a `deleted_at` column (soft deletes).
 *   3b. `product_variants` table exists with all required columns.
 *   3c. `reviews` table exists with a unique(user_id, product_id) constraint.
 *   3d. `order_items` table has an `engraving_text` nullable column.
 *   3e. `users` table has a `stripe_customer_id` nullable column.
 *
 * TDD: Each test was written BEFORE the migrations were created.
 * All tests must fail initially (RED), then pass after implementation (GREEN).
 */
class SchemaMigrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    // ─────────────────────────────────────────────────────
    // 3a — Soft Deletes on Products
    // ─────────────────────────────────────────────────────

    /**
     * The `products` table must have a `deleted_at` column.
     */
    public function test_products_table_has_deleted_at_column(): void
    {
        $this->assertTrue(Schema::hasColumn('products', 'deleted_at'));
    }

    /**
     * Deleting a product via the model must soft-delete (set deleted_at) not hard-delete.
     */
    public function test_deleting_product_sets_deleted_at_not_hard_deletes(): void
    {
        $product = Product::factory()->create();

        $product->delete();

        // Must not be hard deleted from the database
        $this->assertDatabaseHas('products', ['id' => $product->id]);

        // Must be soft-deleted
        $this->assertSoftDeleted($product);
    }

    // ─────────────────────────────────────────────────────
    // 3b — Product Variants Table
    // ─────────────────────────────────────────────────────

    /**
     * The `product_variants` table must exist with required columns.
     */
    public function test_product_variants_table_exists_with_required_columns(): void
    {
        $this->assertTrue(Schema::hasTable('product_variants'));

        $requiredColumns = ['id', 'product_id', 'sku', 'name', 'price', 'stock_quantity', 'attributes', 'created_at', 'updated_at'];
        foreach ($requiredColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('product_variants', $column),
                "Column `{$column}` is missing from `product_variants`."
            );
        }
    }

    /**
     * A Product model must have a hasMany relationship to ProductVariants.
     */
    public function test_product_has_many_variants_relationship(): void
    {
        $product = Product::factory()->create();

        $variant = ProductVariant::create([
            'product_id'     => $product->id,
            'sku'            => 'VAR-001',
            'name'           => 'Gold / Size 7',
            'price'          => 29999.00,
            'stock_quantity' => 5,
        ]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $product->variants);
        $this->assertTrue($product->variants->contains($variant));
    }

    // ─────────────────────────────────────────────────────
    // 3c — Reviews Table
    // ─────────────────────────────────────────────────────

    /**
     * The `reviews` table must exist with the correct columns.
     */
    public function test_reviews_table_exists_with_required_columns(): void
    {
        $this->assertTrue(Schema::hasTable('reviews'));

        $requiredColumns = ['id', 'user_id', 'product_id', 'rating', 'body', 'created_at', 'updated_at'];
        foreach ($requiredColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('reviews', $column),
                "Column `{$column}` is missing from `reviews`."
            );
        }
    }

    /**
     * A user cannot submit two reviews for the same product (unique constraint).
     */
    public function test_reviews_table_has_unique_user_product_constraint(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create();

        Review::create([
            'user_id'    => $user->id,
            'product_id' => $product->id,
            'rating'     => 5,
            'body'       => 'Beautiful ring!',
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        // This second insert must throw a unique constraint violation
        Review::create([
            'user_id'    => $user->id,
            'product_id' => $product->id,
            'rating'     => 3,
            'body'       => 'Duplicate review',
        ]);
    }

    /**
     * Product model must have a hasMany relationship to Reviews.
     */
    public function test_product_has_many_reviews_relationship(): void
    {
        $product = Product::factory()->create();
        $user    = User::factory()->create();

        Review::create([
            'user_id'    => $user->id,
            'product_id' => $product->id,
            'rating'     => 4,
            'body'       => 'Lovely.',
        ]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $product->reviews);
        $this->assertCount(1, $product->reviews);
    }

    // ─────────────────────────────────────────────────────
    // 3d — Engraving Text on Order Items
    // ─────────────────────────────────────────────────────

    /**
     * The `order_items` table must have a nullable `engraving_text` column.
     */
    public function test_order_items_table_has_engraving_text_column(): void
    {
        $this->assertTrue(Schema::hasColumn('order_items', 'engraving_text'));
    }

    // ─────────────────────────────────────────────────────
    // 3e — Stripe Customer ID on Users
    // ─────────────────────────────────────────────────────

    /**
     * The `users` table must have a nullable `stripe_customer_id` column.
     */
    public function test_users_table_has_stripe_customer_id_column(): void
    {
        $this->assertTrue(Schema::hasColumn('users', 'stripe_customer_id'));
    }

    /**
     * The `stripe_customer_id` can be stored and retrieved on the User model.
     */
    public function test_user_model_can_store_stripe_customer_id(): void
    {
        $user = User::factory()->create([
            'stripe_customer_id' => 'cus_TestXYZ123',
        ]);

        $this->assertDatabaseHas('users', [
            'id'                 => $user->id,
            'stripe_customer_id' => 'cus_TestXYZ123',
        ]);

        $this->assertEquals('cus_TestXYZ123', $user->fresh()->stripe_customer_id);
    }
}
