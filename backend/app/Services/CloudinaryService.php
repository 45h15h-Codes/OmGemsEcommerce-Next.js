<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => config('services.cloudinary.cloud_name'),
                'api_key'    => config('services.cloudinary.api_key'),
                'api_secret' => config('services.cloudinary.api_secret'),
            ],
            'url' => [
                'secure' => true,
            ],
        ]);

        $this->cloudinary = new Cloudinary();
    }

    /**
     * Upload any file (image or video) to Cloudinary.
     * Returns the secure URL of the uploaded asset.
     */
    public function upload(UploadedFile|string $file, string $folder = 'omgems', array $options = []): array
    {
        $uploadApi = new UploadApi();

        $path = $file instanceof UploadedFile ? $file->getRealPath() : $file;

        $result = $uploadApi->upload($path, array_merge([
            'folder'        => $folder,
            'resource_type' => 'auto',
            'use_filename'  => true,
            'unique_filename' => true,
        ], $options));

        return [
            'public_id'     => $result['public_id'],
            'url'           => $result['secure_url'],
            'resource_type' => $result['resource_type'],
            'format'        => $result['format'],
            'width'         => $result['width'] ?? null,
            'height'        => $result['height'] ?? null,
            'bytes'         => $result['bytes'],
        ];
    }

    /**
     * Upload multiple files. Returns array of result arrays.
     */
    public function uploadMany(array $files, string $folder = 'omgems'): array
    {
        $results = [];
        foreach ($files as $file) {
            $results[] = $this->upload($file, $folder);
        }
        return $results;
    }

    /**
     * Delete an asset from Cloudinary by public_id.
     */
    public function delete(string $publicId, string $resourceType = 'image'): void
    {
        $uploadApi = new UploadApi();
        $uploadApi->destroy($publicId, ['resource_type' => $resourceType]);
    }
}
