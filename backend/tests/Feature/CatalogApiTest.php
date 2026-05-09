<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Diamond;
use App\Models\DiamondProfile;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalog_lists_only_published_public_products(): void
    {
        $category = Category::create([
            'name' => 'Diamonds',
            'slug' => 'diamonds',
            'type' => 'diamond',
            'is_active' => true,
        ]);

        $published = Product::create([
            'sku' => 'DIA-1',
            'name' => '1.00 Carat Round Diamond',
            'slug' => 'one-carat-round-diamond',
            'product_type' => 'diamond',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => now(),
            'category_id' => $category->id,
            'base_price' => 5000,
            'is_active' => true,
        ]);

        Product::create([
            'sku' => 'DIA-2',
            'name' => 'Hidden Diamond',
            'slug' => 'hidden-diamond',
            'product_type' => 'diamond',
            'status' => 'draft',
            'visibility' => 'public',
            'category_id' => $category->id,
            'base_price' => 1000,
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/catalog/products');

        $response->assertOk()
            ->assertJsonPath('data.0.slug', $published->slug)
            ->assertJsonMissing(['slug' => 'hidden-diamond']);
    }

    public function test_catalog_filters_diamonds_by_shape_and_carat(): void
    {
        $category = Category::create([
            'name' => 'Diamonds',
            'slug' => 'diamonds',
            'type' => 'diamond',
            'is_active' => true,
        ]);

        $round = Product::create([
            'sku' => 'DIA-ROUND',
            'name' => 'Round Diamond',
            'slug' => 'round-diamond',
            'product_type' => 'diamond',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => now(),
            'category_id' => $category->id,
            'base_price' => 5000,
            'is_active' => true,
        ]);

        DiamondProfile::create([
            'product_id' => $round->id,
            'shape' => 'Round',
            'carat' => 1.5,
            'color' => 'D',
            'clarity' => 'VVS1',
        ]);

        $oval = Product::create([
            'sku' => 'DIA-OVAL',
            'name' => 'Oval Diamond',
            'slug' => 'oval-diamond',
            'product_type' => 'diamond',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => now(),
            'category_id' => $category->id,
            'base_price' => 4000,
            'is_active' => true,
        ]);

        DiamondProfile::create([
            'product_id' => $oval->id,
            'shape' => 'Oval',
            'carat' => 0.9,
        ]);

        $response = $this->getJson('/api/catalog/products?shape=Round&carat_min=1');

        $response->assertOk()
            ->assertJsonPath('data.0.slug', 'round-diamond')
            ->assertJsonMissing(['slug' => 'oval-diamond']);
    }

    public function test_legacy_diamond_save_is_mirrored_to_storefront_catalog(): void
    {
        Diamond::create([
            'certificate_number' => 'VGL-20260550001',
            'lab' => 'VGL',
            'carat' => 2.54,
            'color' => 'E',
            'clarity' => 'VVS2',
            'cut' => 'Good',
            'shape' => 'Marquise',
            'price' => 1500,
            'image_urls' => ['diamonds/marquise-front.png', 'diamonds/marquise-side.png'],
            'is_available' => true,
        ]);

        $response = $this->getJson('/api/catalog/products?type=diamond&category=diamonds');

        $response->assertOk()
            ->assertJsonPath('data.0.sku', 'DIA-VGL-20260550001')
            ->assertJsonPath('data.0.diamond.certificate_number', 'VGL-20260550001')
            ->assertJsonPath('data.0.diamond.shape', 'Marquise')
            ->assertJsonPath('data.0.primary_image.url', '/storage/diamonds/marquise-front.png')
            ->assertJsonPath('data.0.media.1.url', '/storage/diamonds/marquise-side.png');
    }

    public function test_product_detail_uses_slug_and_includes_seo_and_related_shape(): void
    {
        $category = Category::create([
            'name' => 'Rings',
            'slug' => 'rings',
            'type' => 'jewelry',
            'is_active' => true,
        ]);

        $product = Product::create([
            'sku' => 'RING-1',
            'name' => 'Solitaire Ring',
            'slug' => 'solitaire-ring',
            'product_type' => 'jewelry',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => now(),
            'category_id' => $category->id,
            'base_price' => 2500,
            'meta_title' => 'Solitaire Ring | Om Gems',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/catalog/products/'.$product->slug);

        $response->assertOk()
            ->assertJsonPath('data.slug', 'solitaire-ring')
            ->assertJsonPath('data.seo.title', 'Solitaire Ring | Om Gems')
            ->assertJsonStructure(['data' => ['breadcrumbs', 'related_products']]);
    }
}
