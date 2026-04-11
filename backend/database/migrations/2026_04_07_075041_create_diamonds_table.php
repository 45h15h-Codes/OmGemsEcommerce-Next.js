<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('diamonds', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_number')->unique();
            $table->string('lab')->default('GIA'); // GIA, IGI, etc.
            $table->decimal('carat', 5, 2);
            $table->string('color', 10);
            $table->string('clarity', 10);
            $table->string('cut', 10)->nullable();
            $table->string('shape', 50);
            $table->decimal('price', 12, 2); // Base price
            $table->json('specs')->nullable(); // Advanced specs (polish, symmetry, fluorescence, etc.)
            $table->string('video_url')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_available')->default(true);
            $table->foreignId('vendor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diamonds');
    }
};
