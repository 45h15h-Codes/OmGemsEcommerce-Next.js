<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $media = $this->media();

        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'slug' => $this->slug,
            'product_type' => $this->product_type,
            'description' => $this->description,
            'price' => (float) $this->base_price,
            'compare_at_price' => $this->compare_at_price ? (float) $this->compare_at_price : null,
            'currency' => $this->currency ?? 'USD',
            'inventory_status' => $this->inventory_status ?? 'in_stock',
            'stock_quantity' => (int) ($this->stock_quantity ?? 0),
            'brand' => $this->brand,
            'collection_name' => $this->collection_name,
            'gender' => $this->gender,
            'occasion' => $this->occasion,
            'attributes' => $this->attributes ?? [],
            'tags' => $this->tags ?? [],
            'category' => new CategoryResource($this->whenLoaded('category')),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'collections' => CollectionResource::collection($this->whenLoaded('collections')),
            'primary_image' => $media[0] ?? null,
            'media' => $media,
            'diamond' => $this->whenLoaded('diamondProfile', fn () => $this->diamondProfile),
            'jewelry' => $this->whenLoaded('jewelryProfile', fn () => $this->jewelryProfile),
            'seo' => [
                'title' => $this->meta_title ?: $this->name,
                'description' => $this->meta_description ?: str($this->description)->limit(155)->toString(),
                'canonical_url' => $this->canonical_url,
            ],
            'breadcrumbs' => $this->breadcrumbs(),
            'related_products' => ProductCardResource::collection($this->whenLoaded('relatedProducts')),
        ];
    }

    private function media(): array
    {
        if ($this->relationLoaded('mediaItems') && $this->mediaItems->isNotEmpty()) {
            return MediaResource::collection($this->mediaItems)->resolve();
        }

        if (! is_array($this->media) || empty($this->media)) {
            return [];
        }

        return collect($this->media)
            ->filter()
            ->values()
            ->map(function ($item, int $index) {
                // New format: associative array with url, type, is_primary
                if (is_array($item)) {
                    return [
                        'url'        => $item['url'] ?? null,
                        'alt_text'   => $item['alt_text'] ?? $this->name,
                        'type'       => $item['type'] ?? 'image',
                        'is_primary' => $item['is_primary'] ?? ($index === 0),
                        'sort_order' => $item['sort_order'] ?? $index,
                    ];
                }

                // Legacy format: plain string URL
                return [
                    'url'        => $item,
                    'alt_text'   => $this->name,
                    'type'       => 'image',
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ];
            })
            ->all();
    }

    private function breadcrumbs(): array
    {
        $breadcrumbs = [
            ['label' => 'Home', 'href' => '/'],
        ];

        if ($this->category) {
            $breadcrumbs[] = [
                'label' => $this->category->name,
                'href' => $this->category->slug === 'diamonds' ? '/diamonds' : '/jewelry/'.$this->category->slug,
            ];
        }

        $breadcrumbs[] = ['label' => $this->name, 'href' => '/product/'.$this->slug];

        return $breadcrumbs;
    }
}
