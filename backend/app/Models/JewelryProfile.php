<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JewelryProfile extends Model
{
    protected $fillable = [
        'product_id',
        'material',
        'metal_purity',
        'gemstone_type',
        'gemstone_count',
        'total_carat_weight',
        'ring_size',
        'style',
        'dimensions',
        'finish_type',
        'is_handmade',
        'is_customizable',
        'luxury_tags',
    ];

    protected $casts = [
        'gemstone_count' => 'integer',
        'total_carat_weight' => 'decimal:3',
        'is_handmade' => 'boolean',
        'is_customizable' => 'boolean',
        'luxury_tags' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
