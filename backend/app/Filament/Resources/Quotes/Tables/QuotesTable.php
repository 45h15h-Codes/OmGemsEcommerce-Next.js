<?php

namespace App\Filament\Resources\Quotes\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Illuminate\Database\Eloquent\Builder;

class QuotesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns(self::columns())
            ->filters(self::filters())
            ->actions(self::actions())
            ->defaultSort('created_at', 'desc')
            ->striped()
            ->searchPlaceholder('Search by quote ID or customer...');
    }

    private static function columns(): array
    {
        return [
            TextColumn::make('id')
                ->label('Quote #')
                ->prefix('#')
                ->fontFamily('mono')
                ->weight('bold')
                ->searchable()
                ->sortable(),

            TextColumn::make('user.name')
                ->label('Customer')
                ->searchable()
                ->sortable()
                ->description(fn ($record) => $record->user?->email),

            TextColumn::make('status')
                ->label('Status')
                ->badge()
                ->color(fn (string $state) => match($state) {
                    'pending'   => 'warning',
                    'reviewing' => 'info',
                    'quoted'    => 'success',
                    'accepted'  => 'success',
                    'declined'  => 'danger',
                    default     => 'gray',
                })
                ->formatStateUsing(fn ($state) => ucfirst($state)),

            TextColumn::make('total_estimate')
                ->label('Quoted Value')
                ->money('USD')
                ->sortable()
                ->alignEnd()
                ->placeholder('—'),

            TextColumn::make('created_at')
                ->label('Submitted')
                ->dateTime('d M Y')
                ->sortable()
                ->since()
                ->tooltip(fn ($record) => $record->created_at->format('d M Y, h:i A')),
        ];
    }

    private static function filters(): array
    {
        return [
            SelectFilter::make('status')
                ->label('Status')
                ->options([
                    'pending'   => 'Pending',
                    'reviewing' => 'Reviewing',
                    'quoted'    => 'Quoted',
                    'accepted'  => 'Accepted',
                    'declined'  => 'Declined',
                ])
                ->multiple(),

            Filter::make('created_at')
                ->label('Date Range')
                ->form([
                    DatePicker::make('from')->label('From'),
                    DatePicker::make('until')->label('Until'),
                ])
                ->query(function (Builder $query, array $data): Builder {
                    return $query
                        ->when($data['from'],  fn ($q) => $q->whereDate('created_at', '>=', $data['from']))
                        ->when($data['until'], fn ($q) => $q->whereDate('created_at', '<=', $data['until']));
                })
                ->indicateUsing(function (array $data): array {
                    $indicators = [];
                    if ($data['from'] ?? null) {
                        $indicators['from'] = 'From ' . \Carbon\Carbon::parse($data['from'])->toFormattedDateString();
                    }
                    if ($data['until'] ?? null) {
                        $indicators['until'] = 'Until ' . \Carbon\Carbon::parse($data['until'])->toFormattedDateString();
                    }
                    return $indicators;
                }),
        ];
    }

    private static function actions(): array
    {
        return [
            ViewAction::make(),
        ];
    }
}
