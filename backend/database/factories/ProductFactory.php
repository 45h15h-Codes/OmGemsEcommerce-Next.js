<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * ProductFactory — Test support for SchemaMigrationTest and beyond.
 *
 * Creates minimal Product records suitable for feature tests.
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);

        return [
            'sku'        => strtoupper(Str::random(8)),
            'name'       => ucfirst($name),
            'slug'       => Str::slug($name),
            'base_price' => $this->faker->randomFloat(2, 500, 50000),
            'is_active'  => true,
            'status'     => 'published',
            'visibility' => 'public',
        ];
    }
}
