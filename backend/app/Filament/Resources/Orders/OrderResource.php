<?php

namespace App\Filament\Resources\Orders;

use App\Filament\Resources\Orders\Pages\ListOrders;
use App\Filament\Resources\Orders\Pages\ViewOrder;
use App\Models\Order;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    // ── Navigation ────────────────────────────────────────
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingBag;

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Sales';
    }

    public static function getNavigationSort(): ?int
    {
        return 10;
    }

    public static function getNavigationLabel(): string
    {
        return 'Orders';
    }

    // ── Badge: shows count of pending orders in sidebar ──
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::pending()->count() ?: null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }

    // ── Resource Config ───────────────────────────────────
    protected static ?string $recordTitleAttribute = 'id';
    protected static ?string $modelLabel           = 'Order';
    protected static ?string $pluralModelLabel     = 'Orders';

    // ── No create/edit — orders arrive via API ────────────
    public static function canCreate(): bool
    {
        return false;
    }

    // ── Form (empty — no editing) ─────────────────────────
    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    // ── Table (built in Step 3) ───────────────────────────
    public static function table(Table $table): Table
    {
        return \App\Filament\Resources\Orders\Tables\OrdersTable::configure($table);
    }

    // ── Infolist (built in Step 4) ────────────────────────
    public static function infolist(Schema $schema): Schema
    {
        return \App\Filament\Resources\Orders\Schemas\OrderInfolist::configure($schema);
    }

    // ── Relations ─────────────────────────────────────────
    public static function getRelations(): array
    {
        return [];
    }

    // ── Pages ─────────────────────────────────────────────
    public static function getPages(): array
    {
        return [
            'index' => ListOrders::route('/'),
            'view'  => ViewOrder::route('/{record}'),
        ];
    }
}
