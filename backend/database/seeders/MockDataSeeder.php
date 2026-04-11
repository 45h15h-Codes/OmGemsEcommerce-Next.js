<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Diamond;
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

        // Create a basic category
        $category = Category::firstOrCreate([
            'slug' => 'engagement-rings',
        ], [
            'name' => 'Engagement Rings',
            'description' => 'Beautiful engagement rings for your special moment.',
        ]);

        // Create a basic product
        Product::firstOrCreate([
            'sku' => 'ER-001',
        ], [
            'name' => 'Classic Solitaire Engagement Ring',
            'slug' => 'classic-solitaire-engagement-ring',
            'description' => 'A timeless classic solitaire ring setting in 18K white gold.',
            'category_id' => $category->id,
            'base_price' => 850.00,
            'attributes' => [
                'metal' => '18K White Gold',
                'setting_type' => 'Prong',
            ],
            'media' => [
                'https://example.com/ring-1.jpg'
            ]
        ]);

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
