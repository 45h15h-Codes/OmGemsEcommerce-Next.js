<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Task 3c — Reviews Table
 *
 * Stores product reviews from authenticated users.
 * The compound unique(user_id, product_id) constraint enforces
 * one review per user per product at the database level.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            $table->unsignedTinyInteger('rating'); // 1–5 stars
            $table->text('body')->nullable();       // review text
            $table->boolean('is_approved')->default(false); // moderation flag

            $table->timestamps();

            // One review per user per product — enforced at DB level
            $table->unique(['user_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
