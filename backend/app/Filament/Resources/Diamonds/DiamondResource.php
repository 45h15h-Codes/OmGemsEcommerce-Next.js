<?php

namespace App\Filament\Resources\Diamonds;

use App\Filament\Resources\Diamonds\Pages\CreateDiamond;
use App\Filament\Resources\Diamonds\Pages\EditDiamond;
use App\Filament\Resources\Diamonds\Pages\ListDiamonds;
use App\Filament\Resources\Diamonds\Schemas\DiamondForm;
use App\Filament\Resources\Diamonds\Tables\DiamondsTable;
use App\Models\Diamond;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DiamondResource extends Resource
{
    protected static ?string $model = Diamond::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return DiamondForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DiamondsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListDiamonds::route('/'),
            'create' => CreateDiamond::route('/create'),
            'edit' => EditDiamond::route('/{record}/edit'),
        ];
    }
}
