<?php

namespace App\Models;

use App\Services\DiamondCatalogSyncService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diamond extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_number',
        'lab',
        'carat',
        'color',
        'clarity',
        'cut',
        'shape',
        'price',
        'specs',
        'video_url',
        'video_urls',
        'image_url',
        'image_urls',
        'is_available',
        'vendor_id',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'carat'        => 'decimal:2',
        'price'        => 'decimal:2',
        'specs'        => 'array',
        'image_urls'   => 'array',
        'video_urls'   => 'array',
    ];

    protected static function booted(): void
    {
        static::saved(function (Diamond $diamond) {
            app(DiamondCatalogSyncService::class)->sync($diamond);
        });

        static::deleted(function (Diamond $diamond) {
            app(DiamondCatalogSyncService::class)->remove($diamond);
        });
    }

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }
}
