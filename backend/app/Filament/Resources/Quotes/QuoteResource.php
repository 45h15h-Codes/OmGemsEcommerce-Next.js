<?php

namespace App\Filament\Resources\Quotes;

use App\Filament\Resources\Quotes\Pages\ListQuotes;
use App\Filament\Resources\Quotes\Pages\ViewQuote;
use App\Models\Quote;
use Filament\Resources\Resource;

class QuoteResource extends Resource
{
    protected static ?string $model = Quote::class;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-document-currency-dollar';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Sales';
    }

    public static function getNavigationSort(): ?int
    {
        return 20;
    }

    public static function getNavigationLabel(): string
    {
        return 'Quotes';
    }

    // ── Badge: pending quotes count ───────────────────────
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    // ── Resource Config ───────────────────────────────────
    protected static ?string $recordTitleAttribute = 'id';
    protected static ?string $modelLabel           = 'Quote';
    protected static ?string $pluralModelLabel     = 'Quotes';

    // ── No create — quotes come from frontend wholesale flow
    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema
    {
        return $schema->components([]);
    }

    public static function table(\Filament\Tables\Table $table): \Filament\Tables\Table
    {
        return \App\Filament\Resources\Quotes\Tables\QuotesTable::configure($table);
    }

    public static function infolist(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema
    {
        return \App\Filament\Resources\Quotes\Schemas\QuoteInfolist::configure($schema);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListQuotes::route('/'),
            'view'  => ViewQuote::route('/{record}'),
        ];
    }
}
