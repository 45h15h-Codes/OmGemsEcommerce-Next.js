<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    // ── No header actions (cannot create orders manually) ─

    // ── Tabs: All / Pending / Wholesale / Partner ─────────
    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Orders'),

            'pending' => Tab::make('Pending')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'pending'))
                ->badge(fn () => Order::pending()->count())
                ->badgeColor('warning'),

            'wholesale' => Tab::make('Wholesale')
                ->modifyQueryUsing(fn (Builder $query) => $query->wholesale()),

            'partner' => Tab::make('Partner')
                ->modifyQueryUsing(fn (Builder $query) => $query->partner()),
        ];
    }
}
