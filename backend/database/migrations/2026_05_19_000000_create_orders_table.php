<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Who placed the order
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Channel this order came from
            $table->enum('order_type', ['wholesale', 'partner']);

            // Order status lifecycle
            $table->enum('status', [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'refunded',
            ])->default('pending');

            // Financials
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->string('currency', 3)->default('USD');

            // Shipping
            $table->json('shipping_address')->nullable();
            $table->string('shipping_method')->nullable();
            $table->string('tracking_number')->nullable();

            // Payment
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('unpaid');
            $table->string('payment_reference')->nullable();

            // Internal notes (admin only)
            $table->text('notes')->nullable();

            // If this order was converted from a Quote
            $table->foreignId('quote_id')->nullable()->constrained()->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            // Indexes for common filter queries
            $table->index(['status', 'order_type']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
