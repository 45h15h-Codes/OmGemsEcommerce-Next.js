<?php

namespace App\Filament\Resources\Diamonds\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DiamondsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('certificate_number')
                    ->searchable(),
                TextColumn::make('lab')
                    ->searchable(),
                TextColumn::make('carat')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('color')
                    ->searchable(),
                TextColumn::make('clarity')
                    ->searchable(),
                TextColumn::make('cut')
                    ->searchable(),
                TextColumn::make('shape')
                    ->searchable(),
                TextColumn::make('price')
                    ->money()
                    ->sortable(),
                TextColumn::make('video_url')
                    ->searchable(),
                ImageColumn::make('image_url'),
                IconColumn::make('is_available')
                    ->boolean(),
                TextColumn::make('vendor_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
