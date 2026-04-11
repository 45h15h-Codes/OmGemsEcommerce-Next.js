<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Diamond; // Assuming this model exists
// use App\Models\Order; // Assuming this model exists
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard stats.
     */
    public function stats(Request $request)
    {
        // Role check is handled by route middleware: check.role:Super Admin,Admin
        // No need for additional checks here.

        // Mocking some stats for now. In a real app, you'd aggregate these from models.
        // e.g. $totalDiamonds = Diamond::count();
        // e.g. $totalUsers = User::count();
        // e.g. $totalOrders = Order::count();

        $totalUsers = User::count();
        // Ensure Diamond exists, otherwise comment it out if it doesn't
        $totalDiamonds = class_exists(\App\Models\Diamond::class) ? \App\Models\Diamond::count() : 120;
        $totalOrders = 45; // Mock for now
        $totalRevenue = 152000; // Mock for now

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_diamonds' => $totalDiamonds,
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
            ],
            'recent_activity' => [
                ['id' => 1, 'description' => 'User John Doe registered.', 'time' => '2 hours ago'],
                ['id' => 2, 'description' => 'Order #1002 placed.', 'time' => '3 hours ago'],
                ['id' => 3, 'description' => 'New diamond listing added by Vendor ABC.', 'time' => '5 hours ago'],
            ]
        ]);
    }
}
