<?php

namespace App\Filament\Concerns;

use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Trait HandleCloudinaryUploads
 *
 * Include this trait in any Filament CreateRecord / EditRecord page to
 * automatically push temporary uploads (images + videos) to Cloudinary
 * before the record is saved and write the resulting URLs back into the
 * model's fillable fields.
 */
trait HandleCloudinaryUploads
{
    /**
     * Called by Filament before persisting the record.
     * We intercept the form data here to push files to Cloudinary.
     */
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->processCloudinaryUploads($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return $this->processCloudinaryUploads($data);
    }

    // ─────────────────────────────────────────────────────────────────────────

    private function processCloudinaryUploads(array $data): array
    {
        /** @var CloudinaryService $cloudinary */
        $cloudinary = app(CloudinaryService::class);

        $imageUrls  = [];
        $videoUrls  = [];

        // ── Images ────────────────────────────────────────────────────────────
        $uploadedImages = $data['_cloudinary_images_upload'] ?? [];
        if (is_array($uploadedImages) && count($uploadedImages)) {
            foreach ($uploadedImages as $tmpPath) {
                try {
                    $fullPath = Storage::disk('public')->path($tmpPath);
                    $result   = $cloudinary->upload($fullPath, 'omgems/diamonds/images');
                    $imageUrls[] = $result['url'];
                    // Remove tmp file after upload
                    Storage::disk('public')->delete($tmpPath);
                } catch (\Throwable $e) {
                    Log::error('Cloudinary image upload failed', ['path' => $tmpPath, 'error' => $e->getMessage()]);
                }
            }
        }

        // ── Videos ────────────────────────────────────────────────────────────
        $uploadedVideos = $data['_cloudinary_videos_upload'] ?? [];
        if (is_array($uploadedVideos) && count($uploadedVideos)) {
            foreach ($uploadedVideos as $tmpPath) {
                try {
                    $fullPath = Storage::disk('public')->path($tmpPath);
                    $result   = $cloudinary->upload($fullPath, 'omgems/diamonds/videos');
                    $videoUrls[] = $result['url'];
                    Storage::disk('public')->delete($tmpPath);
                } catch (\Throwable $e) {
                    Log::error('Cloudinary video upload failed', ['path' => $tmpPath, 'error' => $e->getMessage()]);
                }
            }
        }

        // ── Write URLs back into the model data ───────────────────────────────
        if (count($imageUrls)) {
            // Merge with any existing Cloudinary URLs already stored
            $existing      = is_array($data['image_urls'] ?? null) ? $data['image_urls'] : [];
            $merged        = array_values(array_unique(array_merge($existing, $imageUrls)));
            $data['image_urls'] = $merged;
            $data['image_url']  = $merged[0]; // primary
        }

        if (count($videoUrls)) {
            $existingVideos     = is_array($data['video_urls'] ?? null) ? $data['video_urls'] : [];
            $mergedVideos       = array_values(array_unique(array_merge($existingVideos, $videoUrls)));
            $data['video_urls'] = $mergedVideos;
            $data['video_url']  = $mergedVideos[0]; // primary video
        }

        // Remove the temporary upload fields — they are not DB columns
        unset($data['_cloudinary_images_upload'], $data['_cloudinary_videos_upload']);

        return $data;
    }
}
