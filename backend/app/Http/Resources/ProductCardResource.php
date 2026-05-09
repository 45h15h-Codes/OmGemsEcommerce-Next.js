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
            return [
                'url' => $media[0],
                'alt_text' => $this->name,
                'type' => 'image',
                'is_primary' => true,
            ];
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
            ->map(fn (string $url, int $index) => [
                'url' => $url,
                'alt_text' => $this->name,
                'type' => 'image',
                'is_primary' => $index === 0,
                'sort_order' => $index,
            ])
            ->all();
    }
}
