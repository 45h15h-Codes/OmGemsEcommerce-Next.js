<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Review — Task 3c
 *
 * Represents a customer review for a Product.
 * The unique(user_id, product_id) constraint is enforced at the DB level.
 */
class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'rating',
        'body',
        'is_approved',
    ];

    protected $casts = [
        'rating'      => 'integer',
        'is_approved' => 'boolean',
    ];

    /**
     * The user who wrote this review.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The product this review belongs to.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
