<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\CatalogCollection;
use App\Models\DiamondProfile;
use App\Models\JewelryProfile;
use App\Models\Product;
use App\Models\Diamond;
use App\Services\ProductPlacementService;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class MockDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Require role seeder first
        $this->call(RoleSeeder::class);

        // Create Super Admin
        $admin = User::firstOrCreate([
            'email' => 'admin@omgems.com',
        ], [
            'name' => 'Super Admin',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('Super Admin');

        // Create Regular Admin
        $regularAdmin = User::firstOrCreate([
            'email' => 'manager@omgems.com',
        ], [
            'name' => 'General Admin',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $regularAdmin->assignRole('Admin');

        // Create Partner / Vendor
        $vendor = User::firstOrCreate([
            'email' => 'vendor@partner.com',
        ], [
            'name' => 'Demo Vendor',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $vendor->assignRole('Partner');

        // Create Wholesale Buyer
        $wholesale = User::firstOrCreate([
            'email' => 'buyer@wholesale.com',
        ], [
            'name' => 'Wholesale Buyer',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $wholesale->assignRole('Wholesale Buyer');

        // Create Retail Customer
        $retail = User::firstOrCreate([
            'email' => 'customer@retail.com',
        ], [
            'name' => 'Retail Customer',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $retail->assignRole('Retail Customer');

        $taxonomy = [
            ['name' => 'Diamonds', 'slug' => 'diamonds', 'type' => 'diamond', 'description' => 'Certified loose diamonds with advanced grading filters.', 'sort_order' => 1],
            ['name' => 'High Jewelry', 'slug' => 'high-jewelry', 'type' => 'jewelry', 'description' => 'Rare, atelier-level high jewelry creations.', 'sort_order' => 2, 'is_featured' => true],
            ['name' => 'Rings', 'slug' => 'rings', 'type' => 'jewelry', 'description' => 'Solitaire, engagement, and statement rings.', 'sort_order' => 3],
            ['name' => 'Earrings', 'slug' => 'earrings', 'type' => 'jewelry', 'description' => 'Diamond studs, drops, and sculptural earrings.', 'sort_order' => 4],
            ['name' => 'Necklaces', 'slug' => 'necklaces', 'type' => 'jewelry', 'description' => 'Pendants and necklaces in precious metals.', 'sort_order' => 5],
            ['name' => 'Bracelets', 'slug' => 'bracelets', 'type' => 'jewelry', 'description' => 'Bracelets and bangles crafted for daily brilliance.', 'sort_order' => 6],
            ['name' => 'Engagement Rings', 'slug' => 'engagement-rings', 'type' => 'jewelry', 'description' => 'Beautiful engagement rings for your special moment.', 'sort_order' => 7],
        ];

        $categories = collect($taxonomy)->mapWithKeys(function (array $item) {
            $category = Category::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'type' => $item['type'],
                    'description' => $item['description'],
                    'is_active' => true,
                    'is_featured' => $item['is_featured'] ?? false,
                    'sort_order' => $item['sort_order'],
                    'meta_title' => $item['name'].' | Om Gems',
                    'meta_description' => $item['description'],
                ]
            );

            return [$item['slug'] => $category];
        });

        foreach ([
            ['name' => 'Featured Luxury', 'slug' => 'featured-luxury', 'type' => 'smart', 'description' => 'Homepage-ready luxury placements.', 'is_featured' => true],
            ['name' => 'Diamond Jewelry', 'slug' => 'diamond-jewelry', 'type' => 'smart', 'description' => 'Jewelry designs featuring diamonds.', 'is_featured' => true],
            ['name' => 'Engagement', 'slug' => 'engagement', 'type' => 'smart', 'description' => 'Solitaire and engagement-focused pieces.', 'is_featured' => true],
            ['name' => 'High Jewelry', 'slug' => 'high-jewelry', 'type' => 'smart', 'description' => 'Rare, high-value atelier creations.', 'is_featured' => true],
        ] as $collection) {
            CatalogCollection::updateOrCreate(
                ['slug' => $collection['slug']],
                [
                    'name' => $collection['name'],
                    'type' => $collection['type'],
                    'description' => $collection['description'],
                    'is_active' => true,
                    'is_featured' => $collection['is_featured'],
                    'meta_title' => $collection['name'].' | Om Gems',
                    'meta_description' => $collection['description'],
                ]
            );
        }

        // Create a basic product
        $ring = Product::updateOrCreate([
            'sku' => 'ER-001',
        ], [
            'name' => 'Classic Solitaire Engagement Ring',
            'slug' => 'classic-solitaire-engagement-ring',
            'product_type' => 'jewelry',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => now(),
            'description' => 'A timeless classic solitaire ring setting in 18K white gold.',
            'category_id' => $categories['rings']->id,
            'base_price' => 850.00,
            'currency' => 'USD',
            'inventory_status' => 'in_stock',
            'stock_quantity' => 3,
            'featured' => true,
            'brand' => 'Om Gems',
            'collection_name' => 'Solitaire Series',
            'tags' => ['solitaire', 'engagement', 'diamond'],
            'attributes' => [
                'metal' => '18K White Gold',
                'setting_type' => 'Prong',
            ],
            'media' => [
                '/diamond.png'
            ]
        ]);

        JewelryProfile::updateOrCreate(
            ['product_id' => $ring->id],
            [
                'material' => 'White Gold',
                'metal_purity' => '18K',
                'gemstone_type' => 'Diamond',
                'gemstone_count' => 1,
                'total_carat_weight' => 1.50,
                'ring_size' => '6',
                'style' => 'Solitaire',
                'dimensions' => '2.0 mm band',
                'finish_type' => 'High Polish',
                'is_handmade' => true,
                'is_customizable' => true,
                'luxury_tags' => ['atelier', 'bridal'],
            ]
        );

        $diamondProduct = Product::updateOrCreate([
            'sku' => 'DIA-GIA-1234567890',
        ], [
            'name' => '1.05 Carat Round Diamond',
            'slug' => '1-05-carat-round-diamond-gia-1234567890',
            'product_type' => 'diamond',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => now(),
            'description' => 'GIA-certified round brilliant diamond with excellent polish and symmetry.',
            'category_id' => $categories['diamonds']->id,
            'base_price' => 4500.00,
            'currency' => 'USD',
            'inventory_status' => 'in_stock',
            'stock_quantity' => 1,
            'featured' => true,
            'brand' => 'Om Gems',
            'tags' => ['gia', 'round', 'certified'],
            'media' => ['/diamond.png'],
        ]);

        DiamondProfile::updateOrCreate(
            ['product_id' => $diamondProduct->id],
            [
                'carat' => 1.05,
                'cut' => 'Excellent',
                'color' => 'D',
                'clarity' => 'VVS1',
                'shape' => 'Round',
                'lab' => 'GIA',
                'certificate_number' => 'GIA-1234567890',
                'fluorescence' => 'None',
                'polish' => 'Excellent',
                'symmetry' => 'Excellent',
                'measurements' => '6.50 - 6.54 x 4.02 mm',
                'origin' => 'Natural',
                'stone_type' => 'natural',
                'depth_percent' => 61.8,
                'table_percent' => 57.0,
                'culet' => 'None',
            ]
        );

        app(ProductPlacementService::class)->assign($ring->fresh(['category', 'diamondProfile', 'jewelryProfile']));
        app(ProductPlacementService::class)->assign($diamondProduct->fresh(['category', 'diamondProfile', 'jewelryProfile']));

        // Create a basic diamond
        Diamond::firstOrCreate([
            'certificate_number' => 'GIA-1234567890',
        ], [
            'lab' => 'GIA',
            'carat' => 1.05,
            'color' => 'D',
            'clarity' => 'VVS1',
            'cut' => 'Excellent',
            'shape' => 'Round',
            'price' => 4500.00,
            'specs' => [
                'polish' => 'Excellent',
                'symmetry' => 'Excellent',
                'fluorescence' => 'None',
                'measurements' => '6.50 - 6.54 x 4.02 mm'
            ],
            'is_available' => true,
            'vendor_id' => $vendor->id,
        ]);
    }
}
