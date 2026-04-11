<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'items',
        'status',
        'notes',
        'total_estimate',
        'admin_notes',
        'quoted_at',
    ];

    protected $casts = [
        'items' => 'array',
        'total_estimate' => 'decimal:2',
        'quoted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
