<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Task 3b — Product Variants Table
 *
 * Stores purchasable variants of a product (e.g., "Gold / Size 7").
 * Each variant can have its own SKU, price, stock, and attribute set.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            $table->string('sku')->nullable()->unique();
            $table->string('name'); // e.g., "Gold / Size 7"
            $table->decimal('price', 12, 2);
            $table->unsignedInteger('stock_quantity')->default(0);
            $table->json('attributes')->nullable(); // e.g., { metal: "gold", size: "7" }
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
