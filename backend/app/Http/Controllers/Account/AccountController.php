<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Diamond;
use App\Models\Product;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    /**
     * GET /api/account/overview
     *
     * Account overview stats for retail customer.
     */
    public function overview(Request $request)
    {
        $user = $request->user();

        $wishlistCount = Wishlist::where('user_id', $user->id)->count();

        return response()->json([
            'stats' => [
                'total_orders' => 3,       // Mock — replace when Order model exists
                'pending_orders' => 1,     // Mock
                'total_spent' => 15420,    // Mock
                'wishlist_items' => $wishlistCount,
            ],
            'recent_orders' => [
                [
                    'id' => 3001,
                    'order_number' => 'ORD-2026-3001',
                    'items_count' => 1,
                    'total' => 8250.00,
                    'status' => 'delivered',
                    'tracking_number' => 'FDX-9876543210',
                    'created_at' => now()->subDays(20)->toIso8601String(),
                ],
                [
                    'id' => 3002,
                    'order_number' => 'ORD-2026-3002',
                    'items_count' => 2,
                    'total' => 4370.00,
                    'status' => 'shipped',
                    'tracking_number' => 'UPS-1234567890',
                    'created_at' => now()->subDays(5)->toIso8601String(),
                ],
                [
                    'id' => 3003,
                    'order_number' => 'ORD-2026-3003',
                    'items_count' => 1,
                    'total' => 2800.00,
                    'status' => 'processing',
                    'tracking_number' => null,
                    'created_at' => now()->subDays(1)->toIso8601String(),
                ],
            ],
        ]);
    }

    /**
     * GET /api/account/orders
     *
     * Full order history for retail customer.
     * Mock implementation until Order model exists.
     */
    public function orders(Request $request)
    {
        $orders = [
            [
                'id' => 3001,
                'order_number' => 'ORD-2026-3001',
                'items' => [
                    ['name' => 'Round Brilliant 1.02ct D/VVS1', 'price' => 8250.00],
                ],
                'total' => 8250.00,
                'status' => 'delivered',
                'tracking_number' => 'FDX-9876543210',
                'created_at' => now()->subDays(20)->toIso8601String(),
            ],
            [
                'id' => 3002,
                'order_number' => 'ORD-2026-3002',
                'items' => [
                    ['name' => 'Princess Cut 0.75ct E/VS1', 'price' => 2870.00],
                    ['name' => 'Oval 0.50ct F/VS2', 'price' => 1500.00],
                ],
                'total' => 4370.00,
                'status' => 'shipped',
                'tracking_number' => 'UPS-1234567890',
                'created_at' => now()->subDays(5)->toIso8601String(),
            ],
            [
                'id' => 3003,
                'order_number' => 'ORD-2026-3003',
                'items' => [
                    ['name' => 'Cushion 0.90ct G/VS1', 'price' => 2800.00],
                ],
                'total' => 2800.00,
                'status' => 'processing',
                'tracking_number' => null,
                'created_at' => now()->subDays(1)->toIso8601String(),
            ],
        ];

        return response()->json([
            'data' => $orders,
            'current_page' => 1,
            'last_page' => 1,
            'total' => count($orders),
        ]);
    }

    /**
     * GET /api/account/wishlist
     *
     * Get user's wishlist with related diamonds/products.
     */
    public function wishlistIndex(Request $request)
    {
        $items = Wishlist::where('user_id', $request->user()->id)
            ->with(['diamond', 'product'])
            ->orderByDesc('created_at')
            ->paginate(12);

        return response()->json($items);
    }

    /**
     * POST /api/account/wishlist
     *
     * Add an item to the wishlist.
     */
    public function wishlistStore(Request $request)
    {
        $validated = $request->validate([
            'diamond_id' => 'nullable|exists:diamonds,id',
            'product_id' => 'nullable|exists:products,id',
        ]);

        // Must provide at least one
        if (empty($validated['diamond_id']) && empty($validated['product_id'])) {
            return response()->json(['message' => 'Please provide a diamond_id or product_id.'], 422);
        }

        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where(function ($q) use ($validated) {
                if (!empty($validated['diamond_id'])) {
                    $q->where('diamond_id', $validated['diamond_id']);
                }
                if (!empty($validated['product_id'])) {
                    $q->orWhere('product_id', $validated['product_id']);
                }
            })->first();

        if ($existing) {
            return response()->json(['message' => 'Item already in wishlist.'], 409);
        }

        $item = Wishlist::create([
            'user_id' => $request->user()->id,
            'diamond_id' => $validated['diamond_id'] ?? null,
            'product_id' => $validated['product_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Added to wishlist.',
            'item' => $item->load(['diamond', 'product']),
        ], 201);
    }

    /**
     * DELETE /api/account/wishlist/{id}
     *
     * Remove an item from the wishlist.
     */
    public function wishlistDestroy(Request $request, string $id)
    {
        $item = Wishlist::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $item->delete();

        return response()->json(['message' => 'Removed from wishlist.']);
    }

    /**
     * PUT /api/account/profile
     *
     * Update the retail customer's profile.
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => 'Profile updated.',
            'user' => $request->user()->fresh(),
        ]);
    }
}
