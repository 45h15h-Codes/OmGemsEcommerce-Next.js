<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavLink extends Model
{
    protected $fillable = ['label', 'url', 'location', 'order_index', 'is_active'];
    protected $casts = [
        'is_active' => 'boolean',
    ];
}
