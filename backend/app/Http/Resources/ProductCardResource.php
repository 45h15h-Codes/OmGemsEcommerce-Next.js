<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $primaryMedia = $this->relationLoaded('mediaItems') ? $this->primaryMedia() : null;

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
            'featured' => (bool) ($this->featured ?? false),
            'primary_image' => $primaryMedia ? (new MediaResource($primaryMedia))->resolve() : $this->legacyImage(),
            'media' => $this->legacyMedia(),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'diamond' => $this->whenLoaded('diamondProfile', fn () => $this->diamondProfile),
            'jewelry' => $this->whenLoaded('jewelryProfile', fn () => $this->jewelryProfile),
            'tags' => $this->tags ?? [],
        ];
    }

    private function legacyImage(): ?array
    {
        $media = $this->media;

        if (is_array($media) && count($media) > 0) {
            $item = $media[0];
            $url = is_array($item) ? ($item['url'] ?? null) : (is_string($item) ? $item : null);

            if ($url) {
                return [
                    'url' => $url,
                    'alt_text' => $this->name,
                    'type' => is_array($item) ? ($item['type'] ?? 'image') : 'image',
                    'is_primary' => true,
                ];
            }
        }

        return null;
    }

    private function legacyMedia(): array
    {
        $media = $this->media;

        if (! is_array($media)) {
            return [];
        }

        return collect($media)
            ->filter()
            ->values()
            ->map(function ($item, int $index) {
                if (is_array($item)) {
                    return [
                        'url' => $item['url'] ?? null,
                        'alt_text' => $item['alt_text'] ?? $this->name,
                        'type' => $item['type'] ?? 'image',
                        'is_primary' => $item['is_primary'] ?? ($index === 0),
                        'sort_order' => $item['sort_order'] ?? $index,
                    ];
                }

                return [
                    'url' => $item,
                    'alt_text' => $this->name,
                    'type' => 'image',
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ];
            })
            ->filter(fn ($m) => !empty($m['url']))
            ->values()
            ->all();
    }
}
