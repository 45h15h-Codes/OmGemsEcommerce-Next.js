<?php

namespace App\Filament\Widgets;

use App\Models\Diamond;
use App\Models\Order;
use App\Models\Product;
use App\Models\Quote;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class OrdersStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    // Refresh every 60 seconds
    protected ?string $pollingInterval = '60s';

    protected function getStats(): array
    {
        $today     = now()->startOfDay();
        $thisMonth = now()->startOfMonth();

        // Orders today
        $ordersToday = Order::whereDate('created_at', today())->count();

        // Pending orders
        $pendingOrders = Order::pending()->count();

        // Pending quotes
        $pendingQuotes = Quote::where('status', 'pending')->count();

        // Revenue this month (delivered orders only)
        $monthRevenue = Order::where('status', 'delivered')
            ->where('created_at', '>=', $thisMonth)
            ->sum('total');

        // Last month revenue for trend
        $lastMonthRevenue = Order::where('status', 'delivered')
            ->whereBetween('created_at', [
                now()->subMonth()->startOfMonth(),
                now()->subMonth()->endOfMonth(),
            ])
            ->sum('total');

        $revenueTrend = $lastMonthRevenue > 0
            ? (($monthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : 0;

        // Total products
        $totalProducts = Product::count();

        // Total diamonds
        $totalDiamonds = Diamond::count();

        return [
            Stat::make('Orders Today', $ordersToday)
                ->description('New orders placed today')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),

            Stat::make('Pending Orders', $pendingOrders)
                ->description('Awaiting confirmation')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingOrders > 0 ? 'warning' : 'success')
                ->url(route('filament.super-admin.resources.orders.index', ['activeTab' => 'pending'])),

            Stat::make('Pending Quotes', $pendingQuotes)
                ->description('Awaiting review')
                ->descriptionIcon('heroicon-m-document-currency-dollar')
                ->color($pendingQuotes > 0 ? 'warning' : 'success')
                ->url(route('filament.super-admin.resources.quotes.index', ['activeTab' => 'pending'])),

            Stat::make('Revenue This Month', '$' . number_format($monthRevenue, 2))
                ->description(
                    ($revenueTrend >= 0 ? '↑ ' : '↓ ') .
                    abs(round($revenueTrend, 1)) . '% vs last month'
                )
                ->descriptionIcon($revenueTrend >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueTrend >= 0 ? 'success' : 'danger'),

            Stat::make('Total Products', $totalProducts)
                ->description('Active in catalog')
                ->descriptionIcon('heroicon-m-tag')
                ->color('gray'),

            Stat::make('Total Diamonds', $totalDiamonds)
                ->description('In inventory')
                ->descriptionIcon('heroicon-m-sparkles')
                ->color('gray'),
        ];
    }
}
