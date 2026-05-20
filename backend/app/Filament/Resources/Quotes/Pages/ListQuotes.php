<?php

namespace App\Filament\Resources\Quotes\Pages;

use App\Filament\Resources\Quotes\QuoteResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListQuotes extends ListRecords
{
    protected static string $resource = QuoteResource::class;

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Quotes'),

            'pending' => Tab::make('Pending')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'pending'))
                ->badge(fn () => \App\Models\Quote::where('status', 'pending')->count())
                ->badgeColor('warning'),

            'reviewing' => Tab::make('Reviewing')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'reviewing')),

            'quoted' => Tab::make('Quoted')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'quoted')),

            'accepted' => Tab::make('Accepted')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'accepted')),

            'declined' => Tab::make('Declined')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'declined')),
        ];
    }
}
