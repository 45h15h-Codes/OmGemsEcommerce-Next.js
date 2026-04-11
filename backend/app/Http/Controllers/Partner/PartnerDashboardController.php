<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Models\Diamond;
use Illuminate\Http\Request;

class PartnerDashboardController extends Controller
{
    /**
     * GET /api/partner/stats
     *
     * Returns aggregated dashboard statistics scoped to the authenticated partner.
     * All queries filter by vendor_id = auth()->id() so partners only see their own data.
     */
    public function stats(Request $request)
    {
        $vendorId = $request->user()->id;

        $totalDiamonds = Diamond::where('vendor_id', $vendorId)->count();
        $activeDiamonds = Diamond::where('vendor_id', $vendorId)->where('is_available', true)->count();
        $inactiveDiamonds = $totalDiamonds - $activeDiamonds;

        // Revenue: sum of prices of all vendor diamonds (mock: real would use orders)
        $totalInventoryValue = Diamond::where('vendor_id', $vendorId)->sum('price');

        // Mock order stats for now (real implementation would use Order model)
        $pendingOrders = 3;
        $completedOrders = 12;
        $totalRevenue = 48500.00;

        return response()->json([
            'stats' => [
                'total_diamonds' => $totalDiamonds,
                'active_diamonds' => $activeDiamonds,
                'inactive_diamonds' => $inactiveDiamonds,
                'inventory_value' => round($totalInventoryValue, 2),
                'pending_orders' => $pendingOrders,
                'completed_orders' => $completedOrders,
                'total_revenue' => $totalRevenue,
            ],
            'recent_activity' => [
                ['id' => 1, 'description' => 'Diamond #D-' . rand(1000, 9999) . ' listing updated.', 'time' => '1 hour ago', 'type' => 'update'],
                ['id' => 2, 'description' => 'New order received for 2 stones.', 'time' => '3 hours ago', 'type' => 'order'],
                ['id' => 3, 'description' => 'Diamond #D-' . rand(1000, 9999) . ' marked as available.', 'time' => '5 hours ago', 'type' => 'status'],
                ['id' => 4, 'description' => 'Payment of $12,500 received.', 'time' => '1 day ago', 'type' => 'payment'],
            ]
        ]);
    }
}
