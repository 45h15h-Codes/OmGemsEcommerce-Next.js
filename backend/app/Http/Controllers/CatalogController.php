<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\CollectionResource;
use App\Http\Resources\FilterSchemaResource;
use App\Http\Resources\ProductCardResource;
use App\Http\Resources\ProductDetailResource;
use App\Models\CatalogCollection;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CatalogController extends Controller
{
    public function products(Request $request)
    {
        $query = $this->baseProductQuery();
        $this->applyFilters($query, $request);
        $this->applySort($query, $request->input('sort', 'featured'));

        return ProductCardResource::collection(
            $query->paginate($request->integer('per_page', 12))->withQueryString()
        );
    }

    public function product(string $slug)
    {
        $product = $this->baseProductQuery()
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Product::query()
            ->published()
            ->with(['category', 'mediaItems', 'diamondProfile', 'jewelryProfile'])
            ->whereKeyNot($product->id)
            ->where(function (Builder $query) use ($product) {
                $query->where('product_type', $product->product_type);

                if ($product->category_id) {
                    $query->orWhere('category_id', $product->category_id);
                }
            })
            ->limit(4)
            ->get();

        $product->setRelation('relatedProducts', $related);

        return new ProductDetailResource($product);
    }

    public function categories()
    {
        $data = Cache::remember('catalog.categories.tree', now()->addMinutes(10), function () {
            $categories = Category::query()
                ->where('is_active', true)
                ->whereNull('parent_id')
                ->with(['children' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order')->orderBy('name')])
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get();

            return CategoryResource::collection($categories)->resolve();
        });

        return response()->json(['data' => $data]);
    }

    public function category(Request $request, string $slug)
    {
        $category = Category::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $query = $this->baseProductQuery()
            ->where(function (Builder $query) use ($category) {
                $query->where('category_id', $category->id)
                    ->orWhereHas('categories', fn (Builder $q) => $q->whereKey($category->id));
            });

        $this->applyFilters($query, $request);
        $this->applySort($query, $request->input('sort', 'featured'));

        return response()->json([
            'category' => new CategoryResource($category),
            'products' => ProductCardResource::collection(
                $query->paginate($request->integer('per_page', 12))->withQueryString()
            )->response()->getData(true),
            'filters' => $this->filterDefinitions($category->slug),
        ]);
    }

    public function collection(Request $request, string $slug)
    {
        $collection = CatalogCollection::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $query = $this->baseProductQuery()
            ->whereHas('collections', fn (Builder $query) => $query->whereKey($collection->id));

        $this->applyFilters($query, $request);
        $this->applySort($query, $request->input('sort', 'featured'));

        return response()->json([
            'collection' => new CollectionResource($collection),
            'products' => ProductCardResource::collection(
                $query->paginate($request->integer('per_page', 12))->withQueryString()
            )->response()->getData(true),
            'filters' => $this->filterDefinitions($collection->slug),
        ]);
    }

    public function filters(Request $request)
    {
        return new FilterSchemaResource($this->filterDefinitions($request->input('category')));
    }

    public function search(Request $request)
    {
        $query = $this->baseProductQuery();
        $request->merge(['search' => $request->input('q', $request->input('search'))]);
        $this->applyFilters($query, $request);
        $this->applySort($query, $request->input('sort', 'relevance'));

        return ProductCardResource::collection(
            $query->paginate($request->integer('per_page', 12))->withQueryString()
        );
    }

    public function home()
    {
        $data = Cache::remember('catalog.home', now()->addMinutes(5), function () {
            $section = fn (Builder $query) => ProductCardResource::collection(
                $query->with(['category', 'mediaItems', 'diamondProfile', 'jewelryProfile'])
                    ->published()
                    ->orderByDesc('featured')
                    ->orderBy('sort_order')
                    ->latest()
                    ->limit(6)
                    ->get()
            )->resolve();

            return [
                'featured' => $section(Product::query()->where('featured', true)),
                'diamonds' => $section(Product::query()->where('product_type', 'diamond')),
                'high_jewelry' => $section(Product::query()->where('product_type', 'high_jewelry')),
                'rings' => $section(Product::query()->whereHas('categories', fn ($q) => $q->where('slug', 'rings'))),
                'earrings' => $section(Product::query()->whereHas('categories', fn ($q) => $q->where('slug', 'earrings'))),
                'collections' => CollectionResource::collection(
                    CatalogCollection::query()->where('is_active', true)->where('is_featured', true)->orderBy('sort_order')->limit(6)->get()
                )->resolve(),
            ];
        });

        return response()->json($data);
    }

    private function baseProductQuery(): Builder
    {
        return Product::query()
            ->published()
            ->with(['category', 'categories', 'collections', 'mediaItems', 'diamondProfile', 'jewelryProfile']);
    }

    private function applyFilters(Builder $query, Request $request): void
    {
        if ($type = $request->input('type')) {
            $query->where('product_type', $type);
        }

        if ($category = $request->input('category')) {
            $query->where(function (Builder $query) use ($category) {
                $query->whereHas('category', fn (Builder $q) => $q->where('slug', $category))
                    ->orWhereHas('categories', fn (Builder $q) => $q->where('slug', $category));
            });
        }

        if ($collection = $request->input('collection')) {
            $query->whereHas('collections', fn (Builder $q) => $q->where('slug', $collection));
        }

        if ($search = $request->input('search')) {
            $query->where(function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereJsonContains('tags', $search)
                    ->orWhereHas('diamondProfile', fn (Builder $q) => $q->where('certificate_number', 'like', "%{$search}%"));
            });
        }

        foreach (['price_min' => '>=', 'price_max' => '<='] as $field => $operator) {
            if ($request->filled($field)) {
                $query->where('base_price', $operator, $request->input($field));
            }
        }

        if ($request->filled('availability')) {
            $query->where('inventory_status', $request->input('availability'));
        }

        $diamondFilters = ['shape', 'color', 'clarity', 'cut', 'polish', 'symmetry', 'fluorescence', 'lab', 'certificate_number', 'stone_type'];
        foreach ($diamondFilters as $field) {
            if ($request->filled($field)) {
                $query->whereHas('diamondProfile', fn (Builder $q) => $q->where($field, $request->input($field)));
            }
        }

        if ($request->filled('carat_min')) {
            $query->whereHas('diamondProfile', fn (Builder $q) => $q->where('carat', '>=', $request->input('carat_min')));
        }

        if ($request->filled('carat_max')) {
            $query->whereHas('diamondProfile', fn (Builder $q) => $q->where('carat', '<=', $request->input('carat_max')));
        }

        $jewelryFilters = ['material', 'metal_purity', 'gemstone_type', 'ring_size', 'style', 'finish_type'];
        foreach ($jewelryFilters as $field) {
            if ($request->filled($field)) {
                $query->whereHas('jewelryProfile', fn (Builder $q) => $q->where($field, $request->input($field)));
            }
        }
    }

    private function applySort(Builder $query, string $sort): void
    {
        match ($sort) {
            'price_asc' => $query->orderBy('base_price'),
            'price_desc' => $query->orderByDesc('base_price'),
            'carat_asc' => $query->withAggregate('diamondProfile', 'carat')->orderBy('diamond_profile_carat'),
            'carat_desc' => $query->withAggregate('diamondProfile', 'carat')->orderByDesc('diamond_profile_carat'),
            'newest' => $query->latest('published_at'),
            default => $query->orderByDesc('featured')->orderBy('sort_order')->latest('published_at'),
        };
    }

    private function filterDefinitions(?string $context = null): array
    {
        $base = [
            ['key' => 'search', 'label' => 'Search', 'type' => 'text'],
            ['key' => 'price_min', 'label' => 'Min Price', 'type' => 'number'],
            ['key' => 'price_max', 'label' => 'Max Price', 'type' => 'number'],
            ['key' => 'availability', 'label' => 'Availability', 'type' => 'select', 'options' => ['in_stock', 'made_to_order', 'sold_out']],
        ];

        $diamond = [
            ['key' => 'stone_type', 'label' => 'Origin', 'type' => 'select', 'options' => ['natural', 'lab_grown']],
            ['key' => 'shape', 'label' => 'Shape', 'type' => 'select', 'options' => ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Pear', 'Radiant', 'Asscher', 'Marquise', 'Heart']],
            ['key' => 'carat_min', 'label' => 'Min Carat', 'type' => 'number'],
            ['key' => 'carat_max', 'label' => 'Max Carat', 'type' => 'number'],
            ['key' => 'color', 'label' => 'Color', 'type' => 'select', 'options' => ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']],
            ['key' => 'clarity', 'label' => 'Clarity', 'type' => 'select', 'options' => ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2']],
            ['key' => 'cut', 'label' => 'Cut', 'type' => 'select', 'options' => ['Excellent', 'Very Good', 'Good']],
            ['key' => 'polish', 'label' => 'Polish', 'type' => 'select', 'options' => ['Excellent', 'Very Good', 'Good']],
            ['key' => 'symmetry', 'label' => 'Symmetry', 'type' => 'select', 'options' => ['Excellent', 'Very Good', 'Good']],
            ['key' => 'fluorescence', 'label' => 'Fluorescence', 'type' => 'select', 'options' => ['None', 'Faint', 'Medium', 'Strong']],
            ['key' => 'lab', 'label' => 'Lab', 'type' => 'select', 'options' => ['GIA', 'IGI', 'GCAL']],
        ];

        $jewelry = [
            ['key' => 'material', 'label' => 'Material', 'type' => 'select', 'options' => ['Gold', 'Platinum', 'Rose Gold', 'White Gold']],
            ['key' => 'metal_purity', 'label' => 'Metal Purity', 'type' => 'select', 'options' => ['18K', '22K', '950 Platinum']],
            ['key' => 'gemstone_type', 'label' => 'Gemstone', 'type' => 'select', 'options' => ['Diamond', 'Emerald', 'Ruby', 'Sapphire']],
            ['key' => 'ring_size', 'label' => 'Ring Size', 'type' => 'text'],
            ['key' => 'style', 'label' => 'Style', 'type' => 'select', 'options' => ['Solitaire', 'Pave', 'Halo', 'Stud', 'Pendant']],
        ];

        if ($context === 'diamonds') {
            return [...$base, ...$diamond];
        }

        if (in_array($context, ['rings', 'earrings', 'necklaces', 'bracelets', 'high-jewelry'], true)) {
            return [...$base, ...$jewelry, ...$diamond];
        }

        return [...$base, ...$diamond, ...$jewelry];
    }
}
