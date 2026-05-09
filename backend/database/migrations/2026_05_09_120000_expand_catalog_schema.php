<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'type')) {
                $table->string('type')->default('storefront')->index()->after('slug');
            }
            if (! Schema::hasColumn('categories', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->index()->after('is_active');
            }
            if (! Schema::hasColumn('categories', 'sort_order')) {
                $table->unsignedInteger('sort_order')->default(0)->index()->after('is_featured');
            }
            if (! Schema::hasColumn('categories', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('description');
            }
            if (! Schema::hasColumn('categories', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_title');
            }
        });

        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'product_type')) {
                $table->string('product_type')->default('jewelry')->index()->after('slug');
            }
            if (! Schema::hasColumn('products', 'status')) {
                $table->string('status')->default('published')->index()->after('product_type');
            }
            if (! Schema::hasColumn('products', 'visibility')) {
                $table->string('visibility')->default('public')->index()->after('status');
            }
            if (! Schema::hasColumn('products', 'published_at')) {
                $table->timestamp('published_at')->nullable()->index()->after('visibility');
            }
            if (! Schema::hasColumn('products', 'featured')) {
                $table->boolean('featured')->default(false)->index()->after('published_at');
            }
            if (! Schema::hasColumn('products', 'sort_order')) {
                $table->unsignedInteger('sort_order')->default(0)->index()->after('featured');
            }
            if (! Schema::hasColumn('products', 'inventory_status')) {
                $table->string('inventory_status')->default('in_stock')->index()->after('base_price');
            }
            if (! Schema::hasColumn('products', 'stock_quantity')) {
                $table->unsignedInteger('stock_quantity')->default(1)->after('inventory_status');
            }
            if (! Schema::hasColumn('products', 'compare_at_price')) {
                $table->decimal('compare_at_price', 12, 2)->nullable()->after('base_price');
            }
            if (! Schema::hasColumn('products', 'currency')) {
                $table->string('currency', 3)->default('USD')->after('compare_at_price');
            }
            if (! Schema::hasColumn('products', 'brand')) {
                $table->string('brand')->nullable()->after('currency');
            }
            if (! Schema::hasColumn('products', 'collection_name')) {
                $table->string('collection_name')->nullable()->index()->after('brand');
            }
            if (! Schema::hasColumn('products', 'gender')) {
                $table->string('gender')->nullable()->index()->after('collection_name');
            }
            if (! Schema::hasColumn('products', 'occasion')) {
                $table->string('occasion')->nullable()->index()->after('gender');
            }
            if (! Schema::hasColumn('products', 'tags')) {
                $table->json('tags')->nullable()->after('media');
            }
            if (! Schema::hasColumn('products', 'manual_placement')) {
                $table->boolean('manual_placement')->default(false)->index()->after('tags');
            }
            if (! Schema::hasColumn('products', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('description');
            }
            if (! Schema::hasColumn('products', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_title');
            }
            if (! Schema::hasColumn('products', 'canonical_url')) {
                $table->string('canonical_url')->nullable()->after('meta_description');
            }

            if (! $this->indexExists('products', 'products_public_catalog_idx')) {
                $table->index(['status', 'visibility', 'product_type'], 'products_public_catalog_idx');
            }
        });

        Schema::table('media', function (Blueprint $table) {
            if (! Schema::hasColumn('media', 'disk')) {
                $table->string('disk')->default('public')->after('id');
            }
            if (! Schema::hasColumn('media', 'url')) {
                $table->string('url')->nullable()->after('file_path');
            }
            if (! Schema::hasColumn('media', 'type')) {
                $table->string('type')->default('image')->index()->after('mime_type');
            }
            if (! Schema::hasColumn('media', 'visibility')) {
                $table->string('visibility')->default('public')->index()->after('type');
            }
            if (! Schema::hasColumn('media', 'sort_order')) {
                $table->unsignedInteger('sort_order')->default(0)->index()->after('visibility');
            }
        });

        if (! Schema::hasTable('collections')) {
            Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('type')->default('manual')->index();
            $table->json('rules')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
            });
        }

        if (! Schema::hasTable('category_product')) {
            Schema::create('category_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_primary')->default(false)->index();
            $table->boolean('is_smart')->default(false)->index();
            $table->timestamps();
            $table->unique(['category_id', 'product_id']);
            });
        }

        if (! Schema::hasTable('collection_product')) {
            Schema::create('collection_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_id')->constrained('collections')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_smart')->default(false)->index();
            $table->timestamps();
            $table->unique(['collection_id', 'product_id']);
            });
        }

        if (! Schema::hasTable('product_media')) {
            Schema::create('product_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('media_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('gallery')->index();
            $table->boolean('is_primary')->default(false)->index();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
            $table->unique(['product_id', 'media_id', 'role']);
            });
        }

        if (! Schema::hasTable('diamond_profiles')) {
            Schema::create('diamond_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('carat', 6, 3)->nullable()->index();
            $table->string('cut')->nullable()->index();
            $table->string('color', 20)->nullable()->index();
            $table->string('clarity', 20)->nullable()->index();
            $table->string('shape', 50)->nullable()->index();
            $table->string('lab', 50)->nullable()->index();
            $table->string('certificate_number')->nullable()->unique();
            $table->string('certificate_url')->nullable();
            $table->string('fluorescence')->nullable()->index();
            $table->string('polish')->nullable()->index();
            $table->string('symmetry')->nullable()->index();
            $table->string('measurements')->nullable();
            $table->string('origin')->nullable()->index();
            $table->string('stone_type')->default('natural')->index();
            $table->decimal('depth_percent', 5, 2)->nullable();
            $table->decimal('table_percent', 5, 2)->nullable();
            $table->string('culet')->nullable();
            $table->string('video_url')->nullable();
            $table->string('view_360_url')->nullable();
            $table->timestamps();
            });
        }

        if (! Schema::hasTable('jewelry_profiles')) {
            Schema::create('jewelry_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('material')->nullable()->index();
            $table->string('metal_purity')->nullable()->index();
            $table->string('gemstone_type')->nullable()->index();
            $table->unsignedInteger('gemstone_count')->nullable();
            $table->decimal('total_carat_weight', 8, 3)->nullable();
            $table->string('ring_size')->nullable()->index();
            $table->string('style')->nullable()->index();
            $table->string('dimensions')->nullable();
            $table->string('finish_type')->nullable()->index();
            $table->boolean('is_handmade')->default(false)->index();
            $table->boolean('is_customizable')->default(false)->index();
            $table->json('luxury_tags')->nullable();
            $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('jewelry_profiles');
        Schema::dropIfExists('diamond_profiles');
        Schema::dropIfExists('product_media');
        Schema::dropIfExists('collection_product');
        Schema::dropIfExists('category_product');
        Schema::dropIfExists('collections');
    }

    private function indexExists(string $table, string $index): bool
    {
        if (! method_exists(Schema::getFacadeRoot(), 'getIndexes')) {
            return false;
        }

        return collect(Schema::getIndexes($table))->contains(fn (array $item) => ($item['name'] ?? null) === $index);
    }
};
