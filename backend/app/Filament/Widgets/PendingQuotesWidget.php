<?php

namespace App\Filament\Widgets;

use App\Models\Quote;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Filament\Actions\Action;

class PendingQuotesWidget extends TableWidget
{
    protected static ?int    $sort    = 3;
    protected static ?string $heading = 'Pending Quotes — Needs Review';
    protected int | string | array $columnSpan = 'full';
    protected ?string $pollingInterval = null;

    protected function getTableRecordsPerPageSelectOptions(): array
    {
        return [5];
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Quote::query()
                    ->with('user')
                    ->where('status', 'pending')
                    ->oldest()
                    ->limit(5)
            )
            ->columns([
                TextColumn::make('id')
                    ->label('Quote #')
                    ->prefix('#')
                    ->fontFamily('mono')
                    ->weight('bold'),

                TextColumn::make('user.name')
                    ->label('Customer'),

                TextColumn::make('user.email')
                    ->label('Email')
                    ->copyable(),

                TextColumn::make('total_estimate')
                    ->label('Value')
                    ->money('USD')
                    ->placeholder('Not priced')
                    ->alignEnd(),

                TextColumn::make('created_at')
                    ->label('Waiting Since')
                    ->since()
                    ->color(fn ($record) => $record->created_at->diffInHours(now()) > 24 ? 'danger' : 'warning')
                    ->tooltip(fn ($record) => $record->created_at->format('d M Y, h:i A')),
            ])
            ->actions([
                Action::make('review')
                    ->label('Review')
                    ->icon('heroicon-m-arrow-right')
                    ->color('warning'),
            ])
            ->emptyStateHeading('No pending quotes')
            ->emptyStateDescription('All quotes have been reviewed.')
            ->emptyStateIcon('heroicon-o-check-circle')
            ->paginated(false);
    }
}
