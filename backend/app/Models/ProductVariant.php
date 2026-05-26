<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ProductVariant — Task 3b
 *
 * Represents a purchasable SKU variant of a Product.
 * Examples: "Gold / Size 7", "Silver / Size 6".
 */
class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'name',
        'price',
        'stock_quantity',
        'attributes',
        'is_active',
    ];

    protected $casts = [
        'price'          => 'decimal:2',
        'stock_quantity' => 'integer',
        'attributes'     => 'array',
        'is_active'      => 'boolean',
    ];

    /**
     * A variant belongs to one parent product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
