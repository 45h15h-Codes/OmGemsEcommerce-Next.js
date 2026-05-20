<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Filament\Actions\Action;

class RecentOrdersWidget extends TableWidget
{
    protected static ?int    $sort    = 2;
    protected static ?string $heading = 'Recent Orders';
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
                Order::query()
                    ->with('user')
                    ->latest()
                    ->limit(5)
            )
            ->columns([
                TextColumn::make('id')
                    ->label('Order #')
                    ->prefix('#')
                    ->fontFamily('mono')
                    ->weight('bold'),

                TextColumn::make('user.name')
                    ->label('Customer'),

                TextColumn::make('order_type')
                    ->label('Type')
                    ->badge()
                    ->color(fn (string $state) => match($state) {
                        'wholesale' => 'info',
                        'partner'   => 'purple',
                        default     => 'gray',
                    })
                    ->formatStateUsing(fn ($state) => ucfirst($state)),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state) => match($state) {
                        'pending'    => 'warning',
                        'confirmed'  => 'info',
                        'processing' => 'info',
                        'shipped'    => 'primary',
                        'delivered'  => 'success',
                        'cancelled'  => 'danger',
                        'refunded'   => 'gray',
                        default      => 'gray',
                    })
                    ->formatStateUsing(fn ($state) => ucfirst($state)),

                TextColumn::make('total')
                    ->label('Total')
                    ->money('USD')
                    ->alignEnd(),

                TextColumn::make('created_at')
                    ->label('Placed')
                    ->since()
                    ->tooltip(fn ($record) => $record->created_at->format('d M Y, h:i A')),
            ])
            ->actions([
                Action::make('view')
                    ->label('View')
                    ->icon('heroicon-m-eye'),
            ])
            ->paginated(false);
    }
}
