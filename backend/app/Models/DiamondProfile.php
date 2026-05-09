<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiamondProfile extends Model
{
    protected $fillable = [
        'product_id',
        'carat',
        'cut',
        'color',
        'clarity',
        'shape',
        'lab',
        'certificate_number',
        'certificate_url',
        'fluorescence',
        'polish',
        'symmetry',
        'measurements',
        'origin',
        'stone_type',
        'depth_percent',
        'table_percent',
        'culet',
        'video_url',
        'view_360_url',
    ];

    protected $casts = [
        'carat' => 'decimal:3',
        'depth_percent' => 'decimal:2',
        'table_percent' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
