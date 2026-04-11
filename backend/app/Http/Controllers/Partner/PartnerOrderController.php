<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PartnerOrderController extends Controller
{
    /**
     * GET /api/partner/orders
     *
     * Returns orders that contain diamonds belonging to this partner.
     * Since there's no Order model yet, we return mock data that represents
     * the expected shape. Replace with real queries when Order model exists.
     *
     * Real implementation would be:
     * Order::whereHas('diamonds', fn($q) => $q->where('vendor_id', auth()->id()))
     *       ->with('diamonds')
     *       ->paginate(10);
     */
    public function index(Request $request)
    {
        $vendorName = $request->user()->name;

        // Mock order data — scoped conceptually to partner
        $orders = [
            [
                'id' => 1001,
                'order_number' => 'ORD-2026-1001',
                'customer_name' => 'Luxury Jewels Inc.',
                'items_count' => 2,
                'total' => 24500.00,
                'status' => 'processing',
                'created_at' => now()->subDays(1)->toIso8601String(),
            ],
            [
                'id' => 1002,
                'order_number' => 'ORD-2026-1002',
                'customer_name' => 'Diamond Exchange Ltd.',
                'items_count' => 1,
                'total' => 8750.00,
                'status' => 'shipped',
                'created_at' => now()->subDays(3)->toIso8601String(),
            ],
            [
                'id' => 1003,
                'order_number' => 'ORD-2026-1003',
                'customer_name' => 'Royal Gems Co.',
                'items_count' => 3,
                'total' => 35200.00,
                'status' => 'delivered',
                'created_at' => now()->subDays(7)->toIso8601String(),
            ],
            [
                'id' => 1004,
                'order_number' => 'ORD-2026-1004',
                'customer_name' => 'Elite Stones Corp.',
                'items_count' => 1,
                'total' => 5600.00,
                'status' => 'pending',
                'created_at' => now()->subDays(0)->toIso8601String(),
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
     * GET /api/partner/orders/{id}
     *
     * Show a single order detail — must contain this partner's diamonds.
     */
    public function show(Request $request, string $id)
    {
        // Mock single order detail
        return response()->json([
            'id' => (int) $id,
            'order_number' => 'ORD-2026-' . $id,
            'customer_name' => 'Luxury Jewels Inc.',
            'items' => [
                [
                    'diamond_id' => 1,
                    'certificate_number' => 'GIA-123456',
                    'shape' => 'Round',
                    'carat' => 1.52,
                    'price' => 12250.00,
                ],
            ],
            'total' => 12250.00,
            'status' => 'processing',
            'tracking_number' => null,
            'created_at' => now()->subDays(1)->toIso8601String(),
        ]);
    }
}
