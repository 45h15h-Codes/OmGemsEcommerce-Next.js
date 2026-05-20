<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Concerns\HandleCloudinaryUploads;
use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditProduct extends EditRecord
{
    use HandleCloudinaryUploads;

    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    /**
     * After Cloudinary URLs are resolved, merge them into the product's
     * `media` JSON array so they are stored properly.
     */
    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data = parent::mutateFormDataBeforeSave($data);
        $data = $this->processCloudinaryUploads($data);
        return $this->mergeMediaUrls($data);
    }

    private function mergeMediaUrls(array $data): array
    {
        $existing = is_array($data['media'] ?? null) ? $data['media'] : [];

        $imageUrls = $data['image_urls'] ?? [];
        $videoUrl  = $data['video_url'] ?? null;

        foreach ($imageUrls as $url) {
            $existing[] = ['url' => $url, 'type' => 'image', 'is_primary' => false];
        }
        if ($videoUrl) {
            $existing[] = ['url' => $videoUrl, 'type' => 'video', 'is_primary' => false];
        }

        if (count($existing)) {
            if (! collect($existing)->contains('is_primary', true)) {
                $existing[0]['is_primary'] = true;
            }
            $data['media'] = $existing;
        }

        unset($data['image_urls'], $data['image_url'], $data['video_url']);

        return $data;
    }
}
