<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = [
        'disk',
        'file_name',
        'file_path',
        'url',
        'mime_type',
        'type',
        'visibility',
        'sort_order',
        'size',
        'alt_text',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_media')
            ->withPivot(['role', 'is_primary', 'sort_order'])
            ->withTimestamps();
    }

    public function publicUrl(): ?string
    {
        if ($this->url) {
            return $this->url;
        }

        if ($this->file_path) {
            return asset('storage/'.$this->file_path);
        }

        return null;
    }
}
