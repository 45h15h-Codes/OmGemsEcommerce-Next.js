<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Diamond;
use App\Models\DiamondProfile;
use App\Models\Product;
use Illuminate\Support\Str;

class DiamondCatalogSyncService
{
    public function sync(Diamond $diamond): Product
    {
        $category = $this->diamondsCategory();
        $sku = $this->sku($diamond);

        $product = Product::query()
            ->where('sku', $sku)
            ->orWhereHas('diamondProfile', fn ($query) => $query->where('certificate_number', $diamond->certificate_number))
            ->first() ?? new Product(['sku' => $sku]);

        $product->fill([
            'sku' => $sku,
            'name' => $this->name($diamond),
            'slug' => $this->slug($diamond),
            'product_type' => 'diamond',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => $product->published_at ?? now(),
            'description' => $this->description($diamond),
            'category_id' => $category->id,
            'base_price' => $diamond->price,
            'currency' => 'USD',
            'inventory_status' => $diamond->is_available ? 'in_stock' : 'sold_out',
            'stock_quantity' => $diamond->is_available ? 1 : 0,
            'brand' => 'Om Gems',
            'tags' => array_values(array_filter([
                strtolower((string) $diamond->lab),
                strtolower((string) $this->shape($diamond->shape)),
                'certified',
            ])),
            'media' => $this->media($diamond),
            'is_active' => true,
        ]);

        $product->save();

        DiamondProfile::updateOrCreate(
            ['product_id' => $product->id],
            [
                'carat' => $diamond->carat,
                'cut' => $this->displayValue($diamond->cut),
                'color' => $diamond->color,
                'clarity' => $diamond->clarity,
                'shape' => $this->shape($diamond->shape),
                'lab' => strtoupper((string) $diamond->lab),
                'certificate_number' => $diamond->certificate_number,
                'fluorescence' => $this->spec($diamond, 'fluorescence'),
                'polish' => $this->spec($diamond, 'polish'),
                'symmetry' => $this->spec($diamond, 'symmetry'),
                'measurements' => $this->spec($diamond, 'measurements'),
                'origin' => $this->spec($diamond, 'origin'),
                'stone_type' => strtolower((string) $this->spec($diamond, 'stone_type')) ?: 'natural',
                'video_url' => $diamond->video_url,
            ]
        );

        return $product;
    }

    public function remove(Diamond $diamond): void
    {
        Product::query()
            ->where('sku', $this->sku($diamond))
            ->orWhereHas('diamondProfile', fn ($query) => $query->where('certificate_number', $diamond->certificate_number))
            ->delete();
    }

    private function diamondsCategory(): Category
    {
        return Category::firstOrCreate(
            ['slug' => 'diamonds'],
            [
                'name' => 'Diamonds',
                'type' => 'diamond',
                'description' => 'Certified loose diamonds with advanced grading filters.',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );
    }

    private function sku(Diamond $diamond): string
    {
        return 'DIA-'.$diamond->certificate_number;
    }

    private function name(Diamond $diamond): string
    {
        return trim(sprintf(
            '%s Carat %s Diamond',
            $diamond->carat,
            $this->shape($diamond->shape)
        ));
    }

    private function slug(Diamond $diamond): string
    {
        return Str::slug($this->name($diamond).'-'.$diamond->certificate_number);
    }

    private function description(Diamond $diamond): ?string
    {
        return is_string($diamond->specs) ? $diamond->specs : null;
    }

    private function media(Diamond $diamond): array
    {
        $images = collect($diamond->image_urls ?? [])
            ->filter()
            ->map(fn (string $path) => $this->publicPath($path));

        if ($diamond->image_url) {
            $images->push($this->publicPath($diamond->image_url));
        }

        $images = $images->unique()->values();

        return $images->isNotEmpty() ? $images->all() : ['/diamond.png'];
    }

    private function publicPath(string $path): string
    {
        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        return '/storage/'.$path;
    }

    private function spec(Diamond $diamond, string $key): ?string
    {
        return is_array($diamond->specs) ? ($diamond->specs[$key] ?? null) : null;
    }

    private function displayValue(?string $value): ?string
    {
        return $value ? Str::headline(strtolower($value)) : null;
    }

    private function shape(?string $value): ?string
    {
        $normalized = strtolower(trim((string) $value));

        return match ($normalized) {
            'marquish', 'marquies', 'marquise' => 'Marquise',
            default => $this->displayValue($value),
        };
    }
}
