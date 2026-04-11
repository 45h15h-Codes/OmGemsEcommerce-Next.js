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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->json('items');              // Array of requested diamond specs / quantities
            $table->enum('status', ['pending', 'reviewing', 'quoted', 'accepted', 'declined'])->default('pending');
            $table->text('notes')->nullable();  // Buyer's notes / special requirements
            $table->decimal('total_estimate', 14, 2)->nullable(); // Admin's estimate once quoted
            $table->text('admin_notes')->nullable(); // Internal admin notes on the quote
            $table->timestamp('quoted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
