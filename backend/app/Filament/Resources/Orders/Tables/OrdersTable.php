<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Actions\ViewAction;
use Filament\Actions\BulkActionGroup;
use Filament\Forms\Components\DatePicker;
use Illuminate\Database\Eloquent\Builder;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns(self::columns())
            ->filters(self::filters())
            ->actions(self::actions())
            ->bulkActions(self::bulkActions())
            ->defaultSort('created_at', 'desc')
            ->striped()
            ->searchPlaceholder('Search by order ID or customer name...');
    }

    // ── Columns ───────────────────────────────────────────

    private static function columns(): array
    {
        return [
            TextColumn::make('id')
                ->label('Order #')
                ->searchable()
                ->sortable()
                ->prefix('#')
                ->fontFamily('mono')
                ->weight('bold'),

            TextColumn::make('user.name')
                ->label('Customer')
                ->searchable()
                ->sortable()
                ->description(fn ($record) => $record->user?->email),

            TextColumn::make('order_type')
                ->label('Type')
                ->badge()
                ->color(fn (string $state) => match($state) {
                    'wholesale' => 'info',
                    'partner'   => 'purple',
                    default     => 'gray',
                })
                ->formatStateUsing(fn (string $state) => ucfirst($state)),

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
                ->formatStateUsing(fn (string $state) => ucfirst($state)),

            TextColumn::make('total')
                ->label('Total')
                ->money(fn ($record) => $record->currency ?? 'USD')
                ->sortable()
                ->alignEnd(),

            TextColumn::make('payment_status')
                ->label('Payment')
                ->badge()
                ->color(fn (string $state) => match($state) {
                    'paid'    => 'success',
                    'unpaid'  => 'danger',
                    'partial' => 'warning',
                    default   => 'gray',
                })
                ->formatStateUsing(fn (string $state) => ucfirst($state)),

            TextColumn::make('items_count')
                ->label('Items')
                ->counts('items')
                ->alignCenter(),

            TextColumn::make('created_at')
                ->label('Placed On')
                ->dateTime('d M Y, h:i A')
                ->sortable()
                ->since()
                ->tooltip(fn ($record) => $record->created_at->format('d M Y, h:i A')),
        ];
    }

    // ── Filters ───────────────────────────────────────────

    private static function filters(): array
    {
        return [
            SelectFilter::make('status')
                ->label('Status')
                ->options([
                    'pending'    => 'Pending',
                    'confirmed'  => 'Confirmed',
                    'processing' => 'Processing',
                    'shipped'    => 'Shipped',
                    'delivered'  => 'Delivered',
                    'cancelled'  => 'Cancelled',
                    'refunded'   => 'Refunded',
                ])
                ->multiple()
                ->preload(),

            SelectFilter::make('order_type')
                ->label('Order Type')
                ->options([
                    'wholesale' => 'Wholesale',
                    'partner'   => 'Partner',
                ]),

            SelectFilter::make('payment_status')
                ->label('Payment Status')
                ->options([
                    'paid'    => 'Paid',
                    'unpaid'  => 'Unpaid',
                    'partial' => 'Partial',
                ]),

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
                    if ($data['from'])  $indicators[] = 'From: ' . $data['from'];
                    if ($data['until']) $indicators[] = 'Until: ' . $data['until'];
                    return $indicators;
                }),
        ];
    }

    // ── Row Actions ───────────────────────────────────────

    private static function actions(): array
    {
        return [
            ViewAction::make(),
        ];
    }

    // ── Bulk Actions ──────────────────────────────────────

    private static function bulkActions(): array
    {
        return [
            BulkActionGroup::make([
                // No bulk delete for orders — soft delete only via explicit action
                // Add export bulk action here later if needed
            ]),
        ];
    }
}
