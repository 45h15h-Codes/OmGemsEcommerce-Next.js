<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'orderable_type',
        'orderable_id',
        'name',
        'sku',
        'quantity',
        'unit_price',
        'total_price',
        'attributes',
        'engraving_text', // Task 3d — custom engraving text captured at order time
    ];

    protected $casts = [
        'attributes'  => 'array',
        'unit_price'  => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function orderable(): MorphTo
    {
        return $this->morphTo();
    }
}
