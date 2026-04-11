<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'slug',
        'description',
        'category_id',
        'base_price',
        'attributes',
        'media',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'base_price' => 'decimal:2',
        'attributes' => 'array',
        'media' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
