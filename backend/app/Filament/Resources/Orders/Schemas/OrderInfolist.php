<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Infolists\Infolist;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\RepeatableEntry;

class OrderInfolist
{
    public static function configure(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Grid::make(3)->schema([

                // ── LEFT COLUMN (2/3 width) ────────────────
                Grid::make(1)->columnSpan(2)->schema([

                    // Order Items
                    Section::make('Order Items')
                        ->icon('heroicon-o-shopping-cart')
                        ->schema([
                            RepeatableEntry::make('items')
                                ->label('')
                                ->schema([
                                    Grid::make(4)->schema([
                                        TextEntry::make('name')
                                            ->label('Item')
                                            ->weight('bold'),

                                        TextEntry::make('sku')
                                            ->label('SKU')
                                            ->fontFamily('mono')
                                            ->placeholder('—'),

                                        TextEntry::make('quantity')
                                            ->label('Qty')
                                            ->alignCenter(),

                                        TextEntry::make('unit_price')
                                            ->label('Unit Price')
                                            ->money('USD')
                                            ->alignEnd(),
                                    ]),
                                ])
                                ->contained(false),
                        ]),

                    // Shipping Information
                    Section::make('Shipping')
                        ->icon('heroicon-o-truck')
                        ->collapsed()
                        ->schema([
                            Grid::make(2)->schema([
                                TextEntry::make('shipping_method')
                                    ->label('Shipping Method')
                                    ->placeholder('Not set'),

                                TextEntry::make('tracking_number')
                                    ->label('Tracking Number')
                                    ->fontFamily('mono')
                                    ->placeholder('Not assigned')
                                    ->copyable(),

                                TextEntry::make('shipping_address.line1')
                                    ->label('Address Line 1')
                                    ->placeholder('—'),

                                TextEntry::make('shipping_address.city')
                                    ->label('City')
                                    ->placeholder('—'),

                                TextEntry::make('shipping_address.state')
                                    ->label('State / Province')
                                    ->placeholder('—'),

                                TextEntry::make('shipping_address.country')
                                    ->label('Country')
                                    ->placeholder('—'),
                            ]),
                        ]),

                    // Internal Notes
                    Section::make('Internal Notes')
                        ->icon('heroicon-o-chat-bubble-left-ellipsis')
                        ->collapsed()
                        ->schema([
                            TextEntry::make('notes')
                                ->label('')
                                ->placeholder('No notes added.')
                                ->markdown(),
                        ]),
                ]),

                // ── RIGHT COLUMN (1/3 width) ───────────────
                Grid::make(1)->columnSpan(1)->schema([

                    // Order Summary
                    Section::make('Order Summary')
                        ->icon('heroicon-o-document-text')
                        ->schema([
                            TextEntry::make('id')
                                ->label('Order #')
                                ->prefix('#')
                                ->fontFamily('mono')
                                ->weight('bold'),

                            TextEntry::make('order_type')
                                ->label('Channel')
                                ->badge()
                                ->color(fn (string $state) => match($state) {
                                    'wholesale' => 'info',
                                    'partner'   => 'purple',
                                    default     => 'gray',
                                })
                                ->formatStateUsing(fn ($state) => ucfirst($state)),

                            TextEntry::make('status')
                                ->label('Order Status')
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

                            TextEntry::make('created_at')
                                ->label('Placed On')
                                ->dateTime('d M Y, h:i A'),

                            TextEntry::make('updated_at')
                                ->label('Last Updated')
                                ->dateTime('d M Y, h:i A'),
                        ]),

                    // Payment Summary
                    Section::make('Payment')
                        ->icon('heroicon-o-credit-card')
                        ->schema([
                            TextEntry::make('payment_status')
                                ->label('Payment Status')
                                ->badge()
                                ->color(fn (string $state) => match($state) {
                                    'paid'    => 'success',
                                    'unpaid'  => 'danger',
                                    'partial' => 'warning',
                                    default   => 'gray',
                                })
                                ->formatStateUsing(fn ($state) => ucfirst($state)),

                            TextEntry::make('payment_method')
                                ->label('Method')
                                ->placeholder('—'),

                            TextEntry::make('payment_reference')
                                ->label('Reference')
                                ->fontFamily('mono')
                                ->placeholder('—')
                                ->copyable(),

                            TextEntry::make('subtotal')
                                ->label('Subtotal')
                                ->money(fn ($record) => $record->currency ?? 'USD'),

                            TextEntry::make('discount')
                                ->label('Discount')
                                ->money(fn ($record) => $record->currency ?? 'USD')
                                ->color('danger'),

                            TextEntry::make('tax')
                                ->label('Tax')
                                ->money(fn ($record) => $record->currency ?? 'USD'),

                            TextEntry::make('total')
                                ->label('Total')
                                ->money(fn ($record) => $record->currency ?? 'USD')
                                ->weight('bold')
                                ->size('lg'),
                        ]),

                    // Customer Info
                    Section::make('Customer')
                        ->icon('heroicon-o-user')
                        ->schema([
                            TextEntry::make('user.name')
                                ->label('Name'),

                            TextEntry::make('user.email')
                                ->label('Email')
                                ->copyable(),

                            TextEntry::make('user.roles.0.name')
                                ->label('Role')
                                ->badge()
                                ->color('gray'),
                        ]),
                ]),
            ]),
        ]);
    }
}
