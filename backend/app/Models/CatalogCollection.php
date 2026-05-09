<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogCollection extends Model
{
    protected $table = 'collections';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'rules',
        'is_active',
        'is_featured',
        'sort_order',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'rules' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'collection_product', 'collection_id', 'product_id')
            ->withPivot(['is_smart'])
            ->withTimestamps();
    }
}
