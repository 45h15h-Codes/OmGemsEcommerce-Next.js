<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [

            // ── Confirm Order ────────────────────────────
            Action::make('confirm')
                ->label('Confirm Order')
                ->icon('heroicon-o-check-circle')
                ->color('info')
                ->visible(fn (Order $record) => $record->status === 'pending')
                ->requiresConfirmation()
                ->modalHeading('Confirm this order?')
                ->modalDescription('This will notify the customer their order is confirmed.')
                ->action(function (Order $record): void {
                    $record->update(['status' => 'confirmed']);
                    Notification::make()
                        ->title('Order confirmed')
                        ->success()
                        ->send();
                }),

            // ── Mark Processing ───────────────────────────
            Action::make('processing')
                ->label('Mark as Processing')
                ->icon('heroicon-o-cog-6-tooth')
                ->color('info')
                ->visible(fn (Order $record) => $record->status === 'confirmed')
                ->requiresConfirmation()
                ->action(function (Order $record): void {
                    $record->update(['status' => 'processing']);
                    Notification::make()
                        ->title('Order marked as processing')
                        ->success()
                        ->send();
                }),

            // ── Mark Shipped ──────────────────────────────
            Action::make('ship')
                ->label('Mark as Shipped')
                ->icon('heroicon-o-truck')
                ->color('primary')
                ->visible(fn (Order $record) => $record->status === 'processing')
                ->form([
                    \Filament\Forms\Components\TextInput::make('tracking_number')
                        ->label('Tracking Number')
                        ->placeholder('Enter tracking number (optional)')
                        ->maxLength(255),
                ])
                ->action(function (Order $record, array $data): void {
                    $record->update([
                        'status'          => 'shipped',
                        'tracking_number' => $data['tracking_number'] ?? $record->tracking_number,
                    ]);
                    Notification::make()
                        ->title('Order marked as shipped')
                        ->success()
                        ->send();
                }),

            // ── Mark Delivered ────────────────────────────
            Action::make('deliver')
                ->label('Mark as Delivered')
                ->icon('heroicon-o-archive-box-arrow-down')
                ->color('success')
                ->visible(fn (Order $record) => $record->status === 'shipped')
                ->requiresConfirmation()
                ->action(function (Order $record): void {
                    $record->update([
                        'status'          => 'delivered',
                        'payment_status'  => 'paid',
                    ]);
                    Notification::make()
                        ->title('Order marked as delivered')
                        ->success()
                        ->send();
                }),

            // ── Cancel Order ──────────────────────────────
            Action::make('cancel')
                ->label('Cancel Order')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->visible(fn (Order $record) => ! in_array($record->status, ['delivered', 'cancelled', 'refunded']))
                ->form([
                    Textarea::make('notes')
                        ->label('Cancellation Reason')
                        ->placeholder('Optional: Add a note about why this order is being cancelled.')
                        ->rows(3),
                ])
                ->requiresConfirmation()
                ->modalHeading('Cancel this order?')
                ->modalDescription('This action cannot be easily undone.')
                ->modalSubmitActionLabel('Yes, cancel order')
                ->action(function (Order $record, array $data): void {
                    $record->update([
                        'status' => 'cancelled',
                        'notes'  => $data['notes']
                            ? ($record->notes ? $record->notes . "\n\nCancellation: " . $data['notes'] : 'Cancellation: ' . $data['notes'])
                            : $record->notes,
                    ]);
                    Notification::make()
                        ->title('Order cancelled')
                        ->warning()
                        ->send();
                }),

            // ── Refund Order ──────────────────────────────
            Action::make('refund')
                ->label('Mark as Refunded')
                ->icon('heroicon-o-arrow-uturn-left')
                ->color('gray')
                ->visible(fn (Order $record) => in_array($record->status, ['delivered', 'cancelled']))
                ->form([
                    Textarea::make('notes')
                        ->label('Refund Notes')
                        ->placeholder('Add refund reference or reason.')
                        ->rows(3),
                ])
                ->requiresConfirmation()
                ->modalHeading('Mark order as refunded?')
                ->action(function (Order $record, array $data): void {
                    $record->update([
                        'status'         => 'refunded',
                        'payment_status' => 'refunded',
                        'notes'          => $data['notes']
                            ? ($record->notes ? $record->notes . "\n\nRefund: " . $data['notes'] : 'Refund: ' . $data['notes'])
                            : $record->notes,
                    ]);
                    Notification::make()
                        ->title('Order marked as refunded')
                        ->success()
                        ->send();
                }),

            // ── Add Internal Note ─────────────────────────
            Action::make('add_note')
                ->label('Add Note')
                ->icon('heroicon-o-pencil-square')
                ->color('gray')
                ->form([
                    Textarea::make('note')
                        ->label('Note')
                        ->required()
                        ->rows(4),
                ])
                ->action(function (Order $record, array $data): void {
                    $existing = $record->notes ? $record->notes . "\n\n" : '';
                    $record->update(['notes' => $existing . now()->format('d M Y H:i') . ': ' . $data['note']]);
                    Notification::make()
                        ->title('Note added')
                        ->success()
                        ->send();
                }),
        ];
    }
}
