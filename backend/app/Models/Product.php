<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Services\ProductPlacementService;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sku',
        'name',
        'slug',
        'product_type',
        'status',
        'visibility',
        'published_at',
        'featured',
        'sort_order',
        'description',
        'meta_title',
        'meta_description',
        'canonical_url',
        'category_id',
        'base_price',
        'compare_at_price',
        'currency',
        'inventory_status',
        'stock_quantity',
        'brand',
        'collection_name',
        'gender',
        'occasion',
        'attributes',
        'media',
        'tags',
        'manual_placement',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'featured' => 'boolean',
        'manual_placement' => 'boolean',
        'published_at' => 'datetime',
        'base_price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'attributes' => 'array',
        'media' => 'array',
        'tags' => 'array',
    ];

    protected static function booted(): void
    {
        static::saved(function (Product $product) {
            app(ProductPlacementService::class)->assign($product);
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class)
            ->withPivot(['is_primary', 'is_smart'])
            ->withTimestamps();
    }

    public function collections()
    {
        return $this->belongsToMany(CatalogCollection::class, 'collection_product', 'product_id', 'collection_id')
            ->withPivot(['is_smart'])
            ->withTimestamps();
    }

    public function mediaItems()
    {
        return $this->belongsToMany(Media::class, 'product_media')
            ->withPivot(['role', 'is_primary', 'sort_order'])
            ->withTimestamps()
            ->orderBy('product_media.sort_order');
    }

    public function diamondProfile()
    {
        return $this->hasOne(DiamondProfile::class);
    }

    public function jewelryProfile()
    {
        return $this->hasOne(JewelryProfile::class);
    }

    /**
     * Task 3b — A product has many purchasable variants.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Task 3c — A product can have many reviews from customers.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function scopePublished($query)
    {
        return $query
            ->where('is_active', true)
            ->where('status', 'published')
            ->where('visibility', 'public');
    }

    public function primaryMedia(): ?Media
    {
        return $this->mediaItems->firstWhere('pivot.is_primary', true) ?? $this->mediaItems->first();
    }
}
