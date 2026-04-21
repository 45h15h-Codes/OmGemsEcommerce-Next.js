<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['title', 'slug', 'content_sections', 'status', 'seo_title', 'seo_description'];
    protected $casts = [
        'content_sections' => 'array',
    ];
}
