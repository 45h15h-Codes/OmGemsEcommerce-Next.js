<?php

namespace App\Filament\Resources\Quotes\Schemas;

use Filament\Infolists\Infolist;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\TextEntry;

class QuoteInfolist
{
    public static function configure(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Grid::make(3)
                    ->schema([
                        Section::make('Quote Details')
                            ->columnSpan(['lg' => 2])
                            ->schema([
                                TextEntry::make('id')
                                    ->label('Quote ID'),
                                TextEntry::make('user.name')
                                    ->label('Customer'),
                                TextEntry::make('status')
                                    ->badge()
                                    ->color(fn (string $state): string => match ($state) {
                                        'pending' => 'warning',
                                        'reviewing' => 'info',
                                        'quoted' => 'primary',
                                        'accepted' => 'success',
                                        'declined' => 'danger',
                                        default => 'secondary',
                                    }),
                                TextEntry::make('total_estimate')
                                    ->money('USD'),
                                TextEntry::make('quoted_at')
                                    ->dateTime(),
                                TextEntry::make('created_at')
                                    ->dateTime(),
                                TextEntry::make('updated_at')
                                    ->dateTime(),
                                TextEntry::make('notes')
                                    ->label('Customer Message')
                                    ->columnSpanFull(),
                                TextEntry::make('admin_notes')
                                    ->label('Internal Notes')
                                    ->columnSpanFull(),
                            ])->columns(2),
                        Section::make('Requested Items')
                            ->columnSpan(['lg' => 1])
                            ->schema([
                                TextEntry::make('items')
                                    ->label('Requested Items')
                                    ->formatStateUsing(function ($state) {
                                        if (!$state) return 'No items specified';
                                        $items = is_array($state) ? $state : json_decode($state, true);
                                        if (!$items) return 'No items specified';
                                        return collect($items)
                                            ->map(fn($item, $i) => ($i+1) . '. ' . (
                                                is_array($item)
                                                ? collect($item)->map(fn($v,$k) => "$k: $v")->implode(', ')
                                                : $item
                                            ))
                                            ->implode("\n");
                                    })
                                    ->markdown()
                                    ->columnSpanFull(),
                            ]),
                    ])
            ]);
    }
}
