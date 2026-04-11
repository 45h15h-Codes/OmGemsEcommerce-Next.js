<?php

namespace App\Http\Controllers\Wholesale;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WholesaleOrderController extends Controller
{
    /**
     * GET /api/wholesale/orders
     *
     * Returns orders for this wholesale buyer.
     * Since there's no Order model yet, we return mock data that represents
     * the expected response shape. Replace with real queries when Order model exists.
     */
    public function orders(Request $request)
    {
        $user = $request->user();

        // Mock order data — scoped to this wholesale buyer
        $orders = [
            [
                'id' => 2001,
                'order_number' => 'WHL-2026-2001',
                'items_count' => 5,
                'total' => 87500.00,
                'payment_method' => 'Wire Transfer',
                'payment_status' => 'paid',
                'status' => 'delivered',
                'created_at' => now()->subDays(14)->toIso8601String(),
            ],
            [
                'id' => 2002,
                'order_number' => 'WHL-2026-2002',
                'items_count' => 3,
                'total' => 52300.00,
                'payment_method' => 'Net-30',
                'payment_status' => 'pending',
                'status' => 'processing',
                'created_at' => now()->subDays(5)->toIso8601String(),
            ],
            [
                'id' => 2003,
                'order_number' => 'WHL-2026-2003',
                'items_count' => 8,
                'total' => 124750.00,
                'payment_method' => 'Wire Transfer',
                'payment_status' => 'paid',
                'status' => 'shipped',
                'created_at' => now()->subDays(2)->toIso8601String(),
            ],
            [
                'id' => 2004,
                'order_number' => 'WHL-2026-2004',
                'items_count' => 2,
                'total' => 31200.00,
                'payment_method' => 'Net-30',
                'payment_status' => 'invoiced',
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
     * GET /api/wholesale/stats
     *
     * Dashboard stats for wholesale buyer.
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        // Quote stats from the real quotes table
        $totalQuotes = Quote::where('user_id', $user->id)->count();
        $pendingQuotes = Quote::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'reviewing'])
            ->count();

        return response()->json([
            'stats' => [
                'total_orders' => 12,      // Mock — replace with Order::where('user_id', $user->id)->count()
                'pending_orders' => 2,     // Mock
                'total_spent' => 295750,   // Mock
                'total_quotes' => $totalQuotes,
                'pending_quotes' => $pendingQuotes,
                'credit_limit' => 500000,  // Mock
                'credit_used' => 295750,   // Mock
            ],
            'recent_activity' => [
                ['id' => 1, 'description' => 'Order WHL-2026-2004 placed for 2 items.', 'time' => '1 hour ago', 'type' => 'order'],
                ['id' => 2, 'description' => 'Quote #QT-103 accepted. Total: $45,200.', 'time' => '3 hours ago', 'type' => 'quote'],
                ['id' => 3, 'description' => 'Shipment WHL-2026-2003 tracking updated.', 'time' => '1 day ago', 'type' => 'shipping'],
                ['id' => 4, 'description' => 'Invoice INV-2026-087 — Net-30 due May 11.', 'time' => '2 days ago', 'type' => 'invoice'],
            ],
        ]);
    }

    /**
     * GET /api/wholesale/quotes
     *
     * All quotes for this wholesale buyer.
     */
    public function quoteIndex(Request $request)
    {
        $quotes = Quote::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($quotes);
    }

    /**
     * POST /api/wholesale/quotes
     *
     * Submit a new bulk quote request.
     */
    public function quoteStore(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.shape' => 'required|string',
            'items.*.carat_min' => 'required|numeric|min:0.01',
            'items.*.carat_max' => 'required|numeric|gte:items.*.carat_min',
            'items.*.color' => 'nullable|string',
            'items.*.clarity' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:2000',
        ]);

        $quote = Quote::create([
            'user_id' => $request->user()->id,
            'items' => $validated['items'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Quote request submitted successfully.',
            'quote' => $quote,
        ], 201);
    }

    /**
     * GET /api/wholesale/quotes/{id}
     *
     * Show single quote detail (scoped to user).
     */
    public function quoteShow(Request $request, string $id)
    {
        $quote = Quote::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($quote);
    }
}
