<?php

namespace App\Models;

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
        'image_url',
        'is_available',
        'vendor_id',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'carat' => 'decimal:2',
        'price' => 'decimal:2',
        'specs' => 'array',
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }
}
