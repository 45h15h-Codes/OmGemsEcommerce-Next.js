<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Concerns\HandleCloudinaryUploads;
use App\Filament\Resources\Products\ProductResource;
use Filament\Resources\Pages\CreateRecord;

class CreateProduct extends CreateRecord
{
    use HandleCloudinaryUploads;

    protected static string $resource = ProductResource::class;

    /**
     * After Cloudinary URLs are resolved, merge them into the product's
     * `media` JSON array so they are stored properly.
     */
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data = parent::mutateFormDataBeforeCreate($data);
        $data = $this->processCloudinaryUploads($data);
        return $this->mergeMediaUrls($data);
    }

    private function mergeMediaUrls(array $data): array
    {
        $existing = is_array($data['media'] ?? null) ? $data['media'] : [];

        // image_urls written by the trait
        $imageUrls = $data['image_urls'] ?? [];
        $videoUrl  = $data['video_url'] ?? null;

        foreach ($imageUrls as $url) {
            $existing[] = ['url' => $url, 'type' => 'image', 'is_primary' => false];
        }
        if ($videoUrl) {
            $existing[] = ['url' => $videoUrl, 'type' => 'video', 'is_primary' => false];
        }

        if (count($existing)) {
            // Mark first item as primary if none set
            if (! collect($existing)->contains('is_primary', true)) {
                $existing[0]['is_primary'] = true;
            }
            $data['media'] = $existing;
        }

        // Clean up temp fields not in products schema
        unset($data['image_urls'], $data['image_url'], $data['video_url']);

        return $data;
    }
}
