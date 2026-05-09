<?php

namespace App\Services;

use App\Models\CatalogCollection;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class ProductPlacementService
{
    public function assign(Product $product): void
    {
        if ($product->manual_placement || $product->status !== 'published') {
            return;
        }

        $product->loadMissing(['diamondProfile', 'jewelryProfile']);

        $categorySlugs = $this->categorySlugs($product);
        $collectionSlugs = $this->collectionSlugs($product);

        $categoryIds = Category::query()
            ->whereIn('slug', $categorySlugs)
            ->pluck('id', 'slug');

        foreach ($categorySlugs as $slug) {
            if (! isset($categoryIds[$slug])) {
                continue;
            }

            $product->categories()->syncWithoutDetaching([
                $categoryIds[$slug] => [
                    'is_primary' => $product->category_id === (int) $categoryIds[$slug],
                    'is_smart' => true,
                ],
            ]);
        }

        $collectionIds = CatalogCollection::query()
            ->whereIn('slug', $collectionSlugs)
            ->pluck('id', 'slug');

        foreach ($collectionSlugs as $slug) {
            if (! isset($collectionIds[$slug])) {
                continue;
            }

            $product->collections()->syncWithoutDetaching([
                $collectionIds[$slug] => ['is_smart' => true],
            ]);
        }
    }

    /**
     * @return array<int, string>
     */
    private function categorySlugs(Product $product): array
    {
        $tags = collect($product->tags ?? [])->map(fn ($tag) => Str::slug((string) $tag));
        $name = Str::lower($product->name.' '.$product->description.' '.$tags->implode(' '));
        $slugs = [];

        if ($product->category?->slug) {
            $slugs[] = $product->category->slug;
        }

        if ($product->product_type === 'diamond' || $product->diamondProfile) {
            $slugs[] = 'diamonds';
        }

        if (str_contains($name, 'earring') || str_contains($name, 'stud')) {
            $slugs[] = 'earrings';
        }

        if (str_contains($name, 'ring') || str_contains($name, 'solitaire')) {
            $slugs[] = 'rings';
        }

        if (str_contains($name, 'necklace') || str_contains($name, 'pendant')) {
            $slugs[] = 'necklaces';
        }

        if (str_contains($name, 'bracelet') || str_contains($name, 'bangle')) {
            $slugs[] = 'bracelets';
        }

        if ($product->product_type === 'high_jewelry' || $tags->contains('high-jewelry') || $product->base_price >= 10000) {
            $slugs[] = 'high-jewelry';
        }

        return array_values(array_unique($slugs));
    }

    /**
     * @return array<int, string>
     */
    private function collectionSlugs(Product $product): array
    {
        $tags = collect($product->tags ?? [])->map(fn ($tag) => Str::slug((string) $tag));
        $name = Str::lower($product->name.' '.$tags->implode(' '));
        $slugs = [];

        if ($product->featured) {
            $slugs[] = 'featured-luxury';
        }

        if ($product->product_type === 'diamond' || $product->diamondProfile || str_contains($name, 'diamond')) {
            $slugs[] = 'diamond-jewelry';
        }

        if (str_contains($name, 'solitaire') || $tags->contains('engagement')) {
            $slugs[] = 'engagement';
        }

        if ($product->product_type === 'high_jewelry' || $product->base_price >= 10000) {
            $slugs[] = 'high-jewelry';
            $slugs[] = 'featured-luxury';
        }

        return array_values(array_unique($slugs));
    }
}
